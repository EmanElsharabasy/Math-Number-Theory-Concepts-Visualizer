import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Copy, Check, ChevronDown, Activity, Code2, Hash } from 'lucide-react';

const MAX_N = 40;

const C_CODE_LINES = [
    "const int MAX_N = 40;",
    "bool is_prime[MAX_N + 1];",
    "",
    "void sieve() {",
    "    for(int i = 2; i <= MAX_N; i++) is_prime[i] = true;",
    "    is_prime[0] = is_prime[1] = false;",
    "",
    "    for (int p = 2; p * p <= MAX_N; p++) {",
    "        if (is_prime[p]) {",
    "            for (int i = p * p; i <= MAX_N; i += p)",
    "                is_prime[i] = false;",
    "        }",
    "    }",
    "}"
];

// Define the generator for step-by-step execution
function* buildSieveSteps() {
    let is_prime = new Array(MAX_N + 1).fill(undefined);
    let ops = 0;

    // Line 1: Global array initialization
    is_prime.fill(false);
    yield { line: 1, is_prime: [...is_prime], p: null, i: null, ops, msg: "Global array is_prime initialized to false by default." };

    // Line 3: Function call
    yield { line: 3, is_prime: [...is_prime], p: null, i: null, ops, msg: "Function sieve() is called." };

    // Line 4: Initializing loop
    yield { line: 4, is_prime: [...is_prime], p: null, i: null, ops, msg: "Initializing loop: setting elements 2 through MAX_N to true." };
    for (let k = 2; k <= MAX_N; k++) {
        is_prime[k] = true;
    }
    yield { line: 4, is_prime: [...is_prime], p: null, i: null, ops, msg: "Array initialized. Assuming all numbers are prime initially." };

    // Line 5: 0 and 1 are false
    yield { line: 5, is_prime: [...is_prime], p: null, i: null, ops, msg: "Marking 0 and 1 as false (composite)." };
    is_prime[0] = false;
    is_prime[1] = false;
    yield { line: 5, is_prime: [...is_prime], p: null, i: null, ops, msg: "0 and 1 are explicitly marked as not prime." };

    // Line 7: Outer loop
    for (let p = 2; p * p <= MAX_N; p++) {
        yield { line: 7, is_prime: [...is_prime], p, i: null, ops, msg: `Outer loop: evaluating p = ${p}.` };
        
        // Line 8: Check if prime
        yield { line: 8, is_prime: [...is_prime], p, i: null, ops, msg: `Checking if is_prime[${p}] is true.` };

        if (is_prime[p]) {
            let startI = p * p;
            yield { line: 9, is_prime: [...is_prime], p, i: null, ops, msg: `${p} is prime! Starting inner loop at i = ${p} * ${p} = ${startI}.` };

            // Inner loop
            for (let i = startI; i <= MAX_N; i += p) {
                yield { line: 9, is_prime: [...is_prime], p, i, ops, msg: `Inner loop: processing multiple i = ${i}.` };
                
                is_prime[i] = false;
                ops++;
                yield { line: 10, is_prime: [...is_prime], p, i, ops, msg: `Marked is_prime[${i}] as false (composite).` };
            }
        } else {
             yield { line: 8, is_prime: [...is_prime], p, i: null, ops, msg: `${p} is already marked false, skipping inner loop.` };
        }
    }

    // Done
    yield { line: 13, is_prime: [...is_prime], p: null, i: null, ops, msg: "Algorithm complete! All remaining true values are confirmed primes." };
}

export function SieveVisualizer() {
    const generatorRef = useRef<Generator<any, void, unknown> | null>(null);
    const isDoneRef = useRef<boolean>(false);
    
    const [state, setState] = useState({
        line: -1,
        is_prime: new Array(MAX_N + 1).fill(undefined),
        p: null as number | null,
        i: null as number | null,
        ops: 0,
        msg: "Press Arrow Down or click 'Step' to begin the visualization"
    });
    
    const [copied, setCopied] = useState(false);

    const reset = useCallback(() => {
        generatorRef.current = buildSieveSteps();
        isDoneRef.current = false;
        setState({
            line: -1,
            is_prime: new Array(MAX_N + 1).fill(undefined),
            p: null,
            i: null,
            ops: 0,
            msg: "Press Arrow Down or click 'Step' to begin the visualization"
        });
    }, []);

    useEffect(() => {
        reset();
    }, [reset]);

    const stepForward = useCallback(() => {
        if (!generatorRef.current || isDoneRef.current) return;
        
        const next = generatorRef.current.next();
        if (!next.done) {
            setState(next.value);
            if (next.value.line === 13) {
                isDoneRef.current = true;
            }
        } else {
            isDoneRef.current = true;
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault(); // Prevent scrolling
                stepForward();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [stepForward]);

    const handleExport = () => {
        const primes: number[] = [];
        for (let k = 2; k <= MAX_N; k++) {
            if (state.is_prime[k] === true) primes.push(k);
        }
        const str = `int primes[] = {${primes.join(', ')}};`;
        navigator.clipboard.writeText(str);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getCellStyles = (num: number) => {
        const isPrimeVal = state.is_prime[num];
        const isCurrentP = state.p === num;
        const isCurrentI = state.i === num;

        let isConfirmed = false;
        if (isDoneRef.current && isPrimeVal === true) isConfirmed = true;
        if (!isDoneRef.current && state.p !== null && num < state.p && isPrimeVal === true) isConfirmed = true;
        if (state.line === 13 && isPrimeVal === true) isConfirmed = true;

        if (isCurrentI) {
            return "bg-rose-500 text-white font-bold border-rose-400 shadow-[0_0_15px_rgba(243,64,64,0.5)] z-10 scale-105";
        }
        if (isCurrentP) {
            return "bg-amber-500 text-amber-950 font-bold border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10 scale-105";
        }
        if (isConfirmed) {
            return "bg-emerald-600/90 text-white font-bold border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
        }
        if (isPrimeVal === false) {
            return "bg-slate-800/50 text-slate-500 line-through opacity-60 border-slate-700/50";
        }
        if (isPrimeVal === true) {
            return "bg-slate-700 text-slate-200 border-slate-600";
        }
        return "bg-slate-800/80 text-slate-500 border-slate-700 border-dashed";
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 flex flex-col xl:flex-row gap-8 font-sans selection:bg-indigo-500/30">
            {/* Left Side: Control Panel & Code Tracker */}
            <div className="w-full xl:w-[600px] flex-shrink-0 flex flex-col gap-6">
                
                {/* Header & Controls */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Code2 className="w-8 h-8 text-indigo-400" />
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Sieve of Eratosthenes
                        </h1>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4">
                        <button 
                            onClick={stepForward}
                            disabled={isDoneRef.current}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.2)]"
                        >
                            <ChevronDown className="w-5 h-5" />
                            Next Step
                        </button>
                        
                        <button 
                            onClick={reset}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-lg font-medium transition-colors border border-slate-700"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>

                        <button 
                            onClick={handleExport}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-lg font-medium transition-colors border border-slate-700 ml-auto"
                        >
                            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            {copied ? "Copied!" : "Export Array"}
                        </button>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-400 bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                        <span>Tip: Press</span>
                        <kbd className="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-300 font-mono shadow-sm">↓</kbd>
                        <span>on your keyboard to step through the algorithm.</span>
                    </div>
                </div>

                {/* Current Action Banner */}
                <div className="bg-indigo-950/50 border border-indigo-500/30 text-indigo-200 p-4 rounded-xl flex items-center gap-4 shadow-lg">
                    <div className={`p-2 rounded-full ${isDoneRef.current ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                        {isDoneRef.current ? <Check className="w-5 h-5" /> : <Play className="w-5 h-5 animate-pulse" />}
                    </div>
                    <span className="font-mono text-[15px] leading-relaxed">{state.msg}</span>
                </div>

                {/* C++ Code Tracker */}
                <div className="bg-[#0f111a] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-mono text-[13px] sm:text-[14px]">
                    <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-2 text-slate-400">
                        <Hash className="w-4 h-4" />
                        <span>sieve.cpp</span>
                    </div>
                    <div className="py-4">
                        {C_CODE_LINES.map((line, idx) => {
                            const isActive = state.line === idx;
                            return (
                                <div 
                                    key={idx} 
                                    className={`px-4 py-1 flex transition-colors duration-150 ${
                                        isActive 
                                            ? 'bg-indigo-500/20 border-l-4 border-indigo-500 text-indigo-100' 
                                            : 'border-l-4 border-transparent text-slate-400'
                                    }`}
                                >
                                    <span className="text-slate-600 select-none w-8 inline-block text-right pr-4 border-r border-slate-800 mr-4">
                                        {idx}
                                    </span>
                                    <span className="whitespace-pre">{line}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Statistics */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-6 xl:mb-0">
                    <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-emerald-400" /> 
                        Statistics
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <div className="text-sm text-slate-400 mb-1">Operations (Cross-outs)</div>
                            <div className="text-3xl font-mono text-indigo-400 font-semibold">{state.ops}</div>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <div className="text-sm text-slate-400 mb-1">Time Complexity</div>
                            <div className="text-xl font-mono text-emerald-400 font-semibold mt-1">O(N log log N)</div>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 col-span-2 flex justify-between items-center">
                            <div className="text-sm text-slate-400">Space Complexity</div>
                            <div className="text-xl font-mono text-amber-400 font-semibold">O(N)</div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Right Side: Visualization Canvas */}
            <div className="flex-grow flex flex-col bg-slate-900/50 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <h2 className="text-2xl font-bold mb-8 text-slate-200 z-10">Visualization Canvas</h2>
                
                {/* 8x5 Grid Container */}
                <div className="flex-grow flex items-center justify-center z-10 w-full">
                    <div className="grid grid-cols-8 gap-3 sm:gap-4 w-full max-w-[800px]">
                        {Array.from({ length: MAX_N }, (_, idx) => {
                            const num = idx + 1;
                            return (
                                <div 
                                    key={num} 
                                    className={`
                                        flex items-center justify-center 
                                        h-14 sm:h-16 md:h-20 
                                        rounded-xl text-lg sm:text-xl md:text-2xl 
                                        transition-all duration-300 border 
                                        ${getCellStyles(num)}
                                    `}
                                >
                                    {num}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-8 pt-6 border-t border-slate-800 z-10 w-full max-w-[800px] mx-auto">
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-300">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-slate-700 border border-slate-600 rounded"></div> 
                            Unvisited / True
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-amber-500 border border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)] rounded"></div> 
                            Current Prime (p)
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-rose-500 border border-rose-400 shadow-[0_0_8px_rgba(243,64,64,0.5)] rounded"></div> 
                            Current Multiple (i)
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-emerald-600/90 border border-emerald-500 rounded"></div> 
                            Confirmed Prime
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-slate-800/80 border border-slate-700 rounded flex items-center justify-center text-slate-500 line-through text-[10px]">x</div> 
                            Marked Composite
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
