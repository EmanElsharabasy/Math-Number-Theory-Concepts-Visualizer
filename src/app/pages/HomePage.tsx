import { ArrowDown, Code, Zap, ChevronRight, Grid3X3, Database } from "lucide-react";
import { Link } from "react-router";

export function HomePage() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-8 max-w-5xl mx-auto text-center z-10">
      <div className="bg-gradient-to-b from-indigo-500/20 to-transparent p-5 rounded-3xl mb-8 border border-indigo-500/20 shadow-xl shadow-indigo-500/10">
        <Code className="w-16 h-16 text-indigo-400" />
      </div>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent pb-2">
        Master Algorithms Visually
      </h1>
      
      <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-3xl leading-relaxed">
        An interactive, step-by-step educational tool for competitive programmers to visualize fundamental algorithms across <strong className="text-slate-300">Number Theory</strong> (Sieve of Eratosthenes, SPF) and <strong className="text-slate-300">Linear Algebra</strong> (Matrix Multiplication).
      </p>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-12 w-full max-w-3xl text-left shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl" />
        <h2 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-3">
          <Zap className="w-6 h-6 text-amber-400" />
          How to Use the Debugger
        </h2>
        <div className="flex items-start gap-5">
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-center shadow-inner mt-1">
            <ArrowDown className="w-8 h-8 text-indigo-400 animate-bounce" />
          </div>
          <div className="space-y-4">
            <p className="text-slate-300 text-lg leading-relaxed">
              The core feature of this tool is its interactive step-by-step execution. When on any algorithm page, press the <kbd className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-md text-indigo-300 font-mono shadow-sm mx-1">Down Arrow</kbd> key on your keyboard.
            </p>
            <p className="text-slate-400 leading-relaxed">
              This action advances the code logic line by line. The interface will highlight the exact C++ statement being executed and simultaneously animate the memory grids to reflect the current state of variables and arrays.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        <Link 
          to="/sieve" 
          className="group flex flex-col items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white p-6 rounded-xl font-medium transition-all duration-300 border border-slate-700 hover:border-indigo-500/50 shadow-lg hover:-translate-y-1 w-48"
        >
          <Database className="w-8 h-8 text-indigo-400 mb-2" />
          <span>Sieve</span>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
        </Link>
        <Link 
          to="/spf" 
          className="group flex flex-col items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white p-6 rounded-xl font-medium transition-all duration-300 border border-slate-700 hover:border-indigo-500/50 shadow-lg hover:-translate-y-1 w-48"
        >
          <Database className="w-8 h-8 text-emerald-400 mb-2" />
          <span>SPF</span>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
        </Link>
        <Link 
          to="/matrix" 
          className="group flex flex-col items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white p-6 rounded-xl font-medium transition-all duration-300 border border-indigo-500 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 w-48"
        >
          <Grid3X3 className="w-8 h-8 text-white mb-2" />
          <span>Matrix Mult</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
