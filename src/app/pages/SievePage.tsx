import React, { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, Copy, Check, ChevronDown, ChevronUp, Activity, Hash } from 'lucide-react';

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

function* buildSieveSteps() {
    let is_prime = new Array(MAX_N + 1).fill(undefined);
    let ops = 0;

    yield { line: -1, is_prime: [...is_prime], p: null, i: null, ops, msg: "Press Arrow Down or click 'Step' to begin the visualization" };

    is_prime.fill(false);
    yield { line: 1, is_prime: [...is_prime], p: null, i: null, ops, msg: "Global array is_prime initialized to false by default." };
    yield { line: 3, is_prime: [...is_prime], p: null, i: null, ops, msg: "Function sieve() is called." };
    yield { line: 4, is_prime: [...is_prime], p: null, i: null, ops, msg: "Initializing loop: setting elements 2 through MAX_N to true." };
    
    for (let k = 2; k <= MAX_N; k++) {
        is_prime[k] = true;
    }
    yield { line: 4, is_prime: [...is_prime], p: null, i: null, ops, msg: "Array initialized. Assuming all numbers are prime initially." };
    yield { line: 5, is_prime: [...is_prime], p: null, i: null, ops, msg: "Marking 0 and 1 as false (composite)." };
    
    is_prime[0] = false;
    is_prime[1] = false;
    yield { line: 5, is_prime: [...is_prime], p: null, i: null, ops, msg: "0 and 1 are explicitly marked as not prime." };

    for (let p = 2; p * p <= MAX_N; p++) {
        yield { line: 7, is_prime: [...is_prime], p, i: null, ops, msg: `Outer loop: evaluating p = ${p}.` };
        yield { line: 8, is_prime: [...is_prime], p, i: null, ops, msg: `Checking if is_prime[${p}] is true.` };

        if (is_prime[p]) {
            let startI = p * p;
            yield { line: 9, is_prime: [...is_prime], p, i: null, ops, msg: `${p} is prime! Starting inner loop at i = ${p} * ${p} = ${startI}.` };

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
    yield { line: 13, is_prime: [...is_prime], p: null, i: null, ops, msg: "Algorithm complete! All remaining true values are confirmed primes." };
}

export function SievePage() {
    const [steps, setSteps] = useState<any[]>([]);
    const [stepIndex, setStepIndex] = useState(0);
    const [copied, setCopied] = useState(false);

    const reset = useCallback(() => {
        setSteps(Array.from(buildSieveSteps()));
        setStepIndex(0);
        setCopied(false);
    }, []);

    useEffect(() => {
        reset();
    }, [reset]);

    const stepForward = useCallback(() => {
        setStepIndex(prev => Math.min(prev + 1, steps.length - 1));
    }, [steps.length]);

    const stepBackward = useCallback(() => {
        setStepIndex(prev => Math.max(prev - 1, 0));
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                stepForward();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                stepBackward();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [stepForward, stepBackward]);

    const state = steps[stepIndex] || {
        line: -1,
        is_prime: new Array(MAX_N + 1).fill(undefined),
        p: null,
        i: null,
        ops: 0,
        msg: "Loading..."
    };

    const isDone = steps.length > 0 && stepIndex === steps.length - 1;

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
        if (isDone && isPrimeVal === true) isConfirmed = true;
        if (!isDone && state.p !== null && num < state.p && isPrimeVal === true) isConfirmed = true;
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
        <div className="flex-grow p-6 flex flex-col gap-6 max-w-[1600px] mx-auto w-full z-10">
            {/* Top Area: Controls & Statistics */}
            <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <button 
                            onClick={stepForward}
                            disabled={isDone || steps.length === 0}
                            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.2)]"
                        >
                            <ChevronDown className="w-5 h-5" />
                            Next (↓)
                        </button>

                        <button 
                            onClick={stepBackward}
                            disabled={stepIndex === 0}
                            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl font-medium transition-all border border-slate-700"
                        >
                            <ChevronUp className="w-5 h-5" />
                            Prev (↑)
                        </button>
                        
                        <button 
                            onClick={reset}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-3 rounded-xl font-medium transition-colors border border-slate-700"
                            title="Reset"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>

                        <button 
                            onClick={handleExport}
                            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-3 rounded-xl font-medium transition-colors border border-slate-700"
                        >
                            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            {copied ? "Copied!" : "Export Array"}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-3 shadow-inner">
                            <Activity className="w-4 h-4 text-indigo-400" />
                            <div className="text-sm text-slate-400">Ops:</div>
                            <div className="text-xl font-mono text-indigo-400 font-semibold">{state.ops}</div>
                        </div>
                        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-3 shadow-inner">
                            <div className="text-sm text-slate-400">Time:</div>
                            <div className="text-sm font-mono text-emerald-400 font-semibold">O(N log log N)</div>
                        </div>
                        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-3 shadow-inner">
                            <div className="text-sm text-slate-400">Space:</div>
                            <div className="text-sm font-mono text-amber-400 font-semibold">O(N)</div>
                        </div>
                    </div>
                </div>

                <div className="bg-indigo-950/50 border border-indigo-500/30 text-indigo-200 p-3 rounded-xl flex items-center gap-3 shadow-inner">
                    <div className={`p-1.5 rounded-full flex-shrink-0 ${isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                        {isDone ? <Check className="w-4 h-4" /> : <Play className="w-4 h-4 animate-pulse" />}
                    </div>
                    <span className="font-mono text-sm leading-relaxed">{state.msg}</span>
                </div>
            </div>

            {/* Main Area: Strict Side-by-Side Flex Layout */}
            <div className="flex flex-row flex-nowrap w-full flex-grow items-stretch gap-6 min-h-[600px] overflow-hidden">
                {/* Left Side: Visualization Canvas (50%) */}
                <div className="w-1/2 flex-1 min-w-0 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative flex flex-col overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                    <h2 className="text-xl font-bold mb-6 text-slate-200 z-10 flex items-center gap-3 flex-shrink-0">
                        Visualization Canvas
                    </h2>
                    
                    <div className="flex-grow flex items-center justify-center z-10 w-full overflow-x-auto">
                        <div className="grid gap-3 lg:gap-4 min-w-[500px] p-2" style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
                            {Array.from({ length: MAX_N }, (_, idx) => {
                                const num = idx + 1;
                                return (
                                    <div 
                                        key={num} 
                                        className={`
                                            flex items-center justify-center 
                                            h-12 lg:h-14 xl:h-16
                                            rounded-xl text-base lg:text-lg xl:text-xl 
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
                    <div className="mt-6 pt-4 border-t border-slate-800 z-10 w-full flex-shrink-0">
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs xl:text-sm font-medium text-slate-300">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-slate-700 border border-slate-600 rounded"></div> Unvisited
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-amber-500 border border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)] rounded"></div> Current Prime
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-rose-500 border border-rose-400 shadow-[0_0_8px_rgba(243,64,64,0.5)] rounded"></div> Current Multiple
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-emerald-600/90 border border-emerald-500 rounded"></div> Confirmed
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-slate-800/80 border border-slate-700 rounded flex items-center justify-center text-slate-500 line-through text-[8px]">x</div> Marked
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: C++ Code Tracker (50%) */}
                <div className="w-1/2 flex-1 min-w-0 bg-[#0f111a] border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl font-mono text-[13px]">
                    <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-slate-400 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4" />
                            <span>sieve.cpp</span>
                        </div>
                        <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-500">C++</span>
                    </div>
                    <div className="py-4 overflow-y-auto flex-grow">
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
                                    <span className="text-slate-600 select-none w-8 inline-block text-right pr-4 border-r border-slate-800 mr-4 flex-shrink-0">
                                        {idx + 1}
                                    </span>
                                    <span className="whitespace-pre">{line}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}