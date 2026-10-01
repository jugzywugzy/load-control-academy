'use client'; 

import { useFlightStore, GENERIC_A320, GENERIC_B738 } from '../../store/useFlightStore';
import { checkZFW, checkTOW } from '../../engine/validation';
import { PayloadItem } from '../../types/aviation.types';
import TrimChart from '../../simulator/TrimChart';
import Loadsheet from '../../simulator/Loadsheet';
import VisualCargoHold from '../../simulator/VisualCargoHold';
export default function Home() {
  const flight = useFlightStore();

  const zfwCheck = checkZFW(flight);
  const towCheck = checkTOW(flight, zfwCheck.actual);
  
  // Dynamic Zone Arms based on active aircraft profile
  const getZoneArm = (zone: 'A' | 'B' | 'C') => {
    const isBoeing = flight.aircraft?.id === 'B738-GENERIC';
    if (zone === 'A') return isBoeing ? 10.0 : 11.0; // Forward
    if (zone === 'B') return isBoeing ? 14.5 : 15.0; // Center
    return isBoeing ? 18.5 : 19.0;                   // Aft
  };

  const addPax = (zone: 'A' | 'B' | 'C', count: number) => {
    const newPax: PayloadItem = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'PAX',
      weight: count * 84, // Standard 84kg per adult
      arm: getZoneArm(zone), 
    };
    flight.addPayload(newPax);
  };

  const addCargo = () => {
    flight.addPayload({
      id: Math.random().toString(36).substring(2, 9),
      type: 'CARGO',
      weight: 1500, 
      arm: flight.aircraft?.id === 'B738-GENERIC' ? 19.5 : 22.5, 
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-400 mb-2">Load Control Academy</h1>
        <p className="text-slate-400 mb-8">Professional Weight & Balance Simulator</p>
        
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-xl mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Simulator Status</h2>
            <span className={`font-mono text-sm ${flight.aircraft ? 'text-emerald-400' : 'text-amber-400'}`}>
              {flight.aircraft ? `ACTIVE: ${flight.aircraft.model}` : 'STANDBY: NO AIRCRAFT'}
            </span>
          </div>
          
          <div className="space-x-3">
            {flight.aircraft && (
              <button onClick={() => flight.initializeFlight(flight.aircraft!)} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded text-sm transition-colors border border-slate-500">
                Reset Load
              </button>
            )}
            <button onClick={() => flight.initializeFlight(GENERIC_A320)} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm font-medium transition-colors">
              Load A320
            </button>
            <button onClick={() => flight.initializeFlight(GENERIC_B738)} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded text-sm font-medium transition-colors">
              Load B737
            </button>
          </div>
        </div>

        {flight.aircraft && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-xl flex flex-col">
              <h3 className="text-lg font-semibold text-slate-300 mb-4 border-b border-slate-700 pb-2">Multi-Zone Loading (LIR)</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center bg-slate-900 p-3 rounded border border-slate-700">
                  <span className="font-medium">Zone A (FWD Cabin)</span>
                  <button onClick={() => addPax('A', 10)} className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm text-emerald-400 border border-slate-600">+10 Pax</button>
                </div>
                <div className="flex justify-between items-center bg-slate-900 p-3 rounded border border-slate-700">
                  <span className="font-medium">Zone B (MID Cabin)</span>
                  <button onClick={() => addPax('B', 10)} className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm text-blue-400 border border-slate-600">+10 Pax</button>
                </div>
                <div className="flex justify-between items-center bg-slate-900 p-3 rounded border border-slate-700">
                  <span className="font-medium">Zone C (AFT Cabin)</span>
                  <button onClick={() => addPax('C', 10)} className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm text-amber-400 border border-slate-600">+10 Pax</button>
                </div>
                <div className="flex justify-between items-center bg-slate-900 p-3 rounded border border-slate-700 mt-4">
                  <span className="font-medium">Lower Deck Cargo</span>
                  <button onClick={addCargo} className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm text-amber-500 border border-slate-600">+1.5t (AFT)</button>
                </div>
              </div>

              <div className="mt-auto">
                <label className="text-sm text-slate-400 block mb-2">Takeoff Fuel (kg)</label>
                <input 
                  type="number" 
                  value={flight.takeoffFuel || ''}
                  onChange={(e) => flight.setTakeoffFuel(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white font-mono"
                  placeholder="Enter Fuel (e.g. 8500)"
                />
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-xl">
              <h3 className="text-lg font-semibold text-slate-300 mb-4 border-b border-slate-700 pb-2">Aerodynamic Trim</h3>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className={`p-3 rounded border ${zfwCheck.isValid ? 'bg-slate-900 border-slate-700' : 'bg-red-900/20 border-red-500'}`}>
                  <div className="text-slate-400 text-sm">ZFW Limit</div>
                  <div className={`font-mono ${!zfwCheck.isValid && 'text-red-400'}`}>{zfwCheck.actual.toLocaleString()} kg</div>
                </div>
                <div className={`p-3 rounded border ${towCheck.isValid ? 'bg-slate-900 border-slate-700' : 'bg-red-900/20 border-red-500'}`}>
                  <div className="text-slate-400 text-sm">TOW Limit</div>
                  <div className={`font-mono ${!towCheck.isValid && 'text-red-400'}`}>{towCheck.actual.toLocaleString()} kg</div>
                </div>
              </div>
              <TrimChart flight={flight} zfw={zfwCheck.actual} tow={towCheck.actual} />
            </div>

          </div>
        )}

        {/* VISUAL CARGO HOLD */}
        {flight.aircraft && (
          <VisualCargoHold />
        )}

        {/* INJECT LOADSHEET AT BOTTOM */}
        {flight.aircraft && (
          <Loadsheet flight={flight} zfw={zfwCheck.actual} tow={towCheck.actual} />
        )}

      </div>
    </main>
  );
}