import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { LayoutDashboard, Calculator, BookOpen } from 'lucide-react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Load Control Academy',
  description: 'Professional Weight & Balance Simulator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-200 flex h-screen overflow-hidden`}>
        
        {/* LEFT SIDEBAR NAV */}
        <nav className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0">
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-xl font-bold text-blue-400 tracking-tight">LCA Training</h1>
          </div>
          
          <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-3">
            <div className="text-xs font-semibold text-slate-500 mb-2 px-3 uppercase tracking-wider">Main Menu</div>
            
            <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors text-sm text-slate-300">
              <LayoutDashboard size={18} className="text-blue-400" />
              Dashboard
            </Link>
            
            <Link href="/simulator" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors text-sm text-slate-300">
              <Calculator size={18} className="text-emerald-400" />
              Lab Simulator
            </Link>

            <div className="text-xs font-semibold text-slate-500 mt-6 mb-2 px-3 uppercase tracking-wider">Curriculum</div>
            
            {/* We will build these actual pages next! */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((phase) => (
              <Link key={phase} href={`/modules/phase-${phase}`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors text-sm text-slate-400">
                <BookOpen size={16} className="text-slate-500" />
                Phase {phase} Module
              </Link>
            ))}
          </div>
        </nav>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 h-full overflow-y-auto">
          {children}
        </main>

      </body>
    </html>
  );
}