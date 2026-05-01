import { Outlet, NavLink } from "react-router";
import { Code2 } from "lucide-react";

export function Root() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 text-indigo-400 font-bold text-xl flex-shrink-0">
            <div className="bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="tracking-wide">AlgoViz</span>
          </div>
          <nav className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pl-4 no-scrollbar">
            <NavLink 
              to="/" 
              end 
              className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-slate-800 text-indigo-300 shadow-inner" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
            >
              Home
            </NavLink>
            <NavLink 
              to="/sieve" 
              className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-slate-800 text-indigo-300 shadow-inner" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
            >
              Sieve
            </NavLink>
            <NavLink 
              to="/spf" 
              className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-slate-800 text-indigo-300 shadow-inner" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
            >
              SPF
            </NavLink>
            <NavLink 
              to="/matrix" 
              className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-slate-800 text-indigo-300 shadow-inner" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
            >
              Matrix Multiplication
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-grow flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        <Outlet />
      </main>
    </div>
  );
}
