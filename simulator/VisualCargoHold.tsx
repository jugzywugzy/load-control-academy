'use client';

import { useState } from 'react';
import { useFlightStore } from '../store/useFlightStore';
import { validateSegregation, DGItem } from '../engine/dgr';

const AVAILABLE_ULDS: DGItem[] = [
  { id: 'AKE1001', weight: 800, dgClass: 'NONE', description: 'Standard Baggage' },
  { id: 'AKE1002', weight: 1200, dgClass: '3', description: 'Flammable Liquids (Paint)' },
  { id: 'AKE1003', weight: 950, dgClass: '5.1', description: 'Oxidizers (Chemicals)' },
  { id: 'AKE1004', weight: 1500, dgClass: '1', description: 'Explosives (Ammunition)' },
];

export default function VisualCargoHold() {
  const flight = useFlightStore();
  const [loadedBays, setLoadedBays] = useState<{ [bay: string]: DGItem[] }>({
    FWD: [],
    AFT: []
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, item: DGItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow dropping
  };

  const handleDrop = (e: React.DragEvent, bayName: string) => {
    e.preventDefault();
    const itemData = e.dataTransfer.getData('application/json');
    if (!itemData) return;

    const incomingItem: DGItem = JSON.parse(itemData);
    const currentBayContents = loadedBays[bayName] || [];

    // Run the Dangerous Goods Validation Engine
    const segregationCheck = validateSegregation(currentBayContents, incomingItem);
    
    if (!segregationCheck.valid) {
      setErrorMsg(segregationCheck.error || 'DG Violation');
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    // Update local visual state
    setLoadedBays(prev => ({
      ...prev,
      [bayName]: [...prev[bayName], incomingItem]
    }));

    // Update global flight store (engine math)
    flight.addPayload({
      id: incomingItem.id + Date.now(), // Ensure unique ID
      type: 'CARGO',
      weight: incomingItem.weight,
      arm: bayName === 'FWD' ? 12.0 : 22.0 // Map bay to physical aircraft arm
    });
  };

  const getBadgeColor = (dgClass: string) => {
    switch(dgClass) {
      case '3': return 'bg-red-600 text-white';
      case '5.1': return 'bg-yellow-500 text-black';
      case '1': return 'bg-orange-600 text-white';
      default: return 'bg-slate-600 text-white';
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-xl flex flex-col mt-6">
      <h3 className="text-lg font-semibold text-slate-300 mb-4 border-b border-slate-700 pb-2">Visual Ramp Loading (Drag & Drop)</h3>
      
      {errorMsg && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm font-semibold animate-pulse">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SOURCE TARMAC */}
        <div className="md:col-span-1 bg-slate-900 p-4 rounded border border-slate-700">
          <h4 className="text-sm font-medium text-slate-400 mb-3">Tarmac ULDs</h4>
          <div className="space-y-2">
            {AVAILABLE_ULDS.map(uld => (
              <div 
                key={uld.id} 
                draggable 
                onDragStart={(e) => handleDragStart(e, uld)}
                className="cursor-move bg-slate-800 border border-slate-600 p-3 rounded flex justify-between items-center hover:bg-slate-700 transition-colors"
              >
                <div>
                  <div className="text-sm font-mono">{uld.id}</div>
                  <div className="text-xs text-slate-400">{uld.weight} kg</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-bold ${getBadgeColor(uld.dgClass)}`}>
                  {uld.dgClass === 'NONE' ? 'GEN' : `CLASS ${uld.dgClass}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AIRCRAFT BAYS */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {['FWD', 'AFT'].map(bay => (
            <div 
              key={bay}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, bay)}
              className="bg-slate-900 p-4 rounded border-2 border-dashed border-slate-600 min-h-[250px] flex flex-col"
            >
              <h4 className="text-sm font-medium text-slate-400 mb-3 text-center">{bay} CARGO HOLD</h4>
              <div className="space-y-2 flex-grow">
                {loadedBays[bay].map((item, idx) => (
                  <div key={idx} className="bg-slate-800 border border-slate-600 p-2 rounded flex justify-between items-center text-sm">
                    <span className="font-mono">{item.id}</span>
                    <span className={`text-[10px] px-1 rounded font-bold ${getBadgeColor(item.dgClass)}`}>
                      {item.dgClass === 'NONE' ? 'GEN' : `CLS ${item.dgClass}`}
                    </span>
                  </div>
                ))}
                {loadedBays[bay].length === 0 && (
                  <div className="text-slate-500 text-xs text-center mt-10">Drag ULDs here</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}