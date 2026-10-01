export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-5xl font-bold text-blue-400 mb-6">Welcome to Load Control Academy</h1>
      <p className="text-xl text-slate-400 max-w-2xl mb-8">
        Your comprehensive training platform for commercial aviation Weight & Balance, IATA regulations, and AHM 517 compliance.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-xl font-bold text-slate-200 mb-2">Phase 1-9 Modules</h2>
          <p className="text-slate-400 text-sm">Review standard operating procedures, dry operating weight math, and structural limits.</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-xl font-bold text-slate-200 mb-2">Live Simulator</h2>
          <p className="text-slate-400 text-sm">Practice ramp loading, drag-and-drop ULDs, and generate live loadsheets.</p>
        </div>
      </div>
    </div>
  );
}