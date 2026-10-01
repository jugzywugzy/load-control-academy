import Link from 'next/link';
import { ArrowRight, BookOpen, AlertTriangle, Scale, Package, Crosshair, Clock, Map, CheckCircle } from 'lucide-react';

const CURRICULUM: Record<string, { title: string; icon: any; content: React.ReactNode }> = {
  '1': {
    title: 'Phase 1: Principles of Flight & Balance',
    icon: Scale,
    content: (
      <div className="space-y-4">
        <p>Before touching a loadsheet, a Load Controller must understand the physical forces acting upon an aircraft. The Center of Gravity (CG) is the exact point where the aircraft would balance perfectly if suspended in mid-air.</p>
        <div className="bg-slate-900 p-4 rounded border border-slate-700 font-mono text-sm mt-4">
          <span className="text-blue-400">FORMULA:</span> Weight × Arm = Moment
        </div>
        <ul className="list-disc pl-5 mt-4 space-y-2 text-slate-300">
          <li><strong>Reference Datum:</strong> An imaginary vertical plane (Station 0) from which all horizontal distances are measured.</li>
          <li><strong>Arm:</strong> The horizontal distance from the Reference Datum to the center of gravity of an item.</li>
          <li><strong>Moment:</strong> The turning effect of a weight around the datum.</li>
        </ul>
      </div>
    )
  },
  '2': {
    title: 'Phase 2: Structural Weight Limitations',
    icon: AlertTriangle,
    content: (
      <div className="space-y-4">
        <p>Every commercial airframe has strict physical limitations designed by the manufacturer. Exceeding these limits can result in structural failure during taxi, takeoff, or flight.</p>
        <ul className="list-disc pl-5 space-y-2 text-slate-300">
          <li><strong className="text-emerald-400">MZFW (Maximum Zero Fuel Weight):</strong> The maximum weight of the aircraft before usable fuel is loaded. This protects the wing roots from bending upward.</li>
          <li><strong className="text-blue-400">MTOW (Maximum Takeoff Weight):</strong> The maximum allowed weight at the start of the takeoff run.</li>
          <li><strong className="text-amber-400">MLW (Maximum Landing Weight):</strong> The maximum weight allowed for touchdown, protecting the landing gear from impact stress.</li>
        </ul>
      </div>
    )
  },
  '3': {
    title: 'Phase 3: The AHM 517 Loadsheet',
    icon: BookOpen,
    content: (
      <div className="space-y-4">
        <p>The IATA AHM 517 is the global standard for manual loadsheets. It legally documents the distribution of Deadload (Passengers and Cargo) and certifies that the aircraft's CG remains within the certified operational envelope.</p>
        <p>It is the final legal document signed by the Load Controller before departure.</p>
      </div>
    )
  },
  '4': {
    title: 'Phase 4: Dangerous Goods (DGR)',
    icon: AlertTriangle,
    content: (
      <div className="space-y-4">
        <p>Dangerous Goods (DG) must be segregated according to the IATA DGR Manual to prevent catastrophic chemical reactions mid-flight.</p>
        <ul className="list-disc pl-5 space-y-2 text-slate-300">
          <li><strong>Class 3 (Flammables):</strong> Cannot be loaded next to Class 5.1 (Oxidizers).</li>
          <li><strong>Class 1 (Explosives):</strong> Requires strict isolation and cannot mix with Flammables.</li>
        </ul>
        <p className="text-sm text-slate-400 italic">You can practice this segregation in the Simulator Lab's Drag-and-Drop Cargo Hold.</p>
      </div>
    )
  },
  '5': {
    title: 'Phase 5: Unit Load Devices (ULDs)',
    icon: Package,
    content: (
      <div className="space-y-4">
        <p>Widebody and modern narrowbody aircraft utilize ULDs (pallets and containers) for rapid loading and securement.</p>
        <p>Common types include the AKE (standard baggage container) and PMC (cargo pallet). Each ULD has a strict Maximum Gross Weight (MGW) and must be locked into the aircraft floor to prevent shifting during turbulence.</p>
      </div>
    )
  },
  '6': {
    title: 'Phase 6: Trim & Stabilizer Settings',
    icon: Crosshair,
    content: (
      <div className="space-y-4">
        <p>The MAC% (Mean Aerodynamic Chord) calculated on your loadsheet directly dictates the aircraft's take-off trim setting.</p>
        <p>The pilots input this MAC% into the flight computer (or set it manually) to adjust the horizontal stabilizer. An incorrect trim setting can result in the nose lifting too early or refusing to lift off at all.</p>
      </div>
    )
  },
  '7': {
    title: 'Phase 7: Last Minute Changes (LMC)',
    icon: Clock,
    content: (
      <div className="space-y-4">
        <p>A Last Minute Change (LMC) occurs when passengers or cargo are added or removed after the final loadsheet has been generated.</p>
        <p>If the LMC weight exceeds the carrier's specified limit (often +/- 300kg to 500kg), a completely new loadsheet must be generated. If it is under the limit, it is recorded manually at the bottom of the existing AHM 517.</p>
      </div>
    )
  },
  '8': {
    title: 'Phase 8: Transit & Multi-Leg Loads',
    icon: Map,
    content: (
      <div className="space-y-4">
        <p>When an aircraft flies a multi-leg route (e.g., Manila &gt; Cebu &gt; Davao), the Load Controller must account for Transit Load.</p>
        <p>Transit bags and cargo remain on the aircraft during the stopover. The new Load Controller must ensure this existing weight is factored into the new ZFW and CG calculations before adding the departing load.</p>
      </div>
    )
  },
  '9': {
    title: 'Phase 9: Final Assessment & Certification',
    icon: CheckCircle,
    content: (
      <div className="space-y-4">
        <p>To achieve certification, Load Controllers must demonstrate 100% accuracy in manual loadsheet calculation and DGR segregation under time pressure.</p>
        <p>Head over to the Simulator Lab. Select an aircraft, distribute the load safely, ensure your ZFW and TOW limits are valid, and generate a legally compliant AHM 517 PDF to complete your training.</p>
      </div>
    )
  }
};

export default async function ModulePage({ params }: { params: Promise<{ phase: string }> }) {
  const resolvedParams = await params;
  const phaseNumber = resolvedParams.phase.replace('phase-', '');
  const moduleData = CURRICULUM[phaseNumber];

  if (!moduleData) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-slate-300 mb-4">Phase {phaseNumber}</h1>
        <p className="text-slate-500">This module is currently under development. Please check back later.</p>
      </div>
    );
  }

  const Icon = moduleData.icon;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-6">
        <div className="bg-blue-600/20 p-3 rounded-lg border border-blue-500/30">
          <Icon className="text-blue-400" size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{moduleData.title}</h1>
          <p className="text-slate-400 mt-1">Load Control Academy Standard Curriculum</p>
        </div>
      </div>
      
      <div className="text-slate-200 text-lg leading-relaxed bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-xl mb-8">
        {moduleData.content}
      </div>

      <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-800">
        <Link 
          href="/simulator" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-md font-medium transition-colors text-white"
        >
          Proceed to Simulator Lab <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}