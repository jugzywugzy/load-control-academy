'use client';

import { useRef, useState } from 'react';
import { FlightState } from '../types/aviation.types';
import { calculateTotalCG, calculateMAC } from '../engine/math';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface LoadsheetProps {
  flight: FlightState;
  zfw: number;
  tow: number;
}

export default function Loadsheet({ flight, zfw, tow }: LoadsheetProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!flight.aircraft) return null;

  const emptyArm = flight.aircraft.trim.referenceArm - 0.5; 
  const zfwCG = calculateTotalCG(flight.aircraft.dow, emptyArm, flight.payload || []);
  const zfwMAC = calculateMAC(zfwCG, flight.aircraft.trim);

  const fuelArm = 14.8;
  const towCG = calculateTotalCG(zfw, zfwCG, [{ weight: flight.takeoffFuel || 0, arm: fuelArm }]);
  const towMAC = calculateMAC(towCG, flight.aircraft.trim);

  const paxPayload = flight.payload.filter(p => p.type === 'PAX').reduce((sum, p) => sum + p.weight, 0);
  const cargoPayload = flight.payload.filter(p => p.type === 'CARGO').reduce((sum, p) => sum + p.weight, 0);
  const paxCount = Math.floor(paxPayload / 84);

  const handleDownloadPDF = async () => {
    // FIX: Added !flight.aircraft to satisfy TypeScript's null checker
    if (!printRef.current || !flight.aircraft) return; 
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(printRef.current, { backgroundColor: '#0f172a' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Loadsheet_${flight.aircraft.id}_LCA001.pdf`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex justify-between items-center bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-300">Legal Documentation</h3>
        <button 
          onClick={handleDownloadPDF} 
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          {isGenerating ? 'Generating PDF...' : 'Sign & Export PDF'}
        </button>
      </div>

      <div ref={printRef} className="bg-slate-900 p-8 rounded-lg border border-slate-700 font-mono text-sm text-slate-300 shadow-xl overflow-x-auto">
        <div className="text-center font-bold mb-4 border-b border-slate-700 pb-2 text-slate-100 text-lg">
          FINAL LOADSHEET - IATA AHM 517
        </div>
        <div className="whitespace-pre">
{`ALL WEIGHTS IN KILOGRAMS
FLIGHT: LCA-001   A/C: ${flight.aircraft.id}   DATE: ${new Date().toLocaleDateString().toUpperCase()}

LOAD IN COMPARTMENTS      : ${cargoPayload.toString().padStart(6)}
PASSENGER/CABIN LOAD      : ${paxPayload.toString().padStart(6)} (TTL PAX: ${paxCount})
TOTAL DEADLOAD            : ${(cargoPayload + paxPayload).toString().padStart(6)}
------------------------------------------------------
DRY OPERATING WEIGHT      : ${flight.aircraft.dow.toString().padStart(6)}
ZERO FUEL WEIGHT ACTUAL   : ${zfw.toString().padStart(6)}  MAX: ${flight.aircraft.limits.mzfw}
TAKEOFF FUEL              : ${(flight.takeoffFuel || 0).toString().padStart(6)}
TAKEOFF WEIGHT ACTUAL     : ${tow.toString().padStart(6)}  MAX: ${flight.aircraft.limits.mtow}
------------------------------------------------------
ZFW MAC %                 : ${zfwMAC.toFixed(2).padStart(6)}
TOW MAC %                 : ${towMAC.toFixed(2).padStart(6)}

LMC (LAST MINUTE CHANGES): 
NIL

LOAD CONTROLLER SIGNATURE: _______________________
`}
        </div>
      </div>
    </div>
  );
}