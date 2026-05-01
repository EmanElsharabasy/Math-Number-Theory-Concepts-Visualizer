import React, { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, ChevronDown, ChevronUp, Activity, Hash, Zap, Check, ListTree } from 'lucide-react';

const MAX_N = 40;

const C_CODE_LINES_SPF = [
    "const int MAX_N = 40;",
    "int spf[MAX_N + 1];",
    "",
    "// Phase 1: Build SPF Array",
    "void build_spf() {",
    "    for (int i = 1; i <= MAX_N; i++) spf[i] = i;",
    "    for (int i = 2; i * i <= MAX_N; i++) {",
    "        if (spf[i] == i) {",
    "            for (int j = i * i; j <= MAX_N; j += i) {",
    "                if (spf[j] == j) spf[j] = i;",
    "            }",
    "        }",
    "    }",
    "}",
    "",
    "// Phase 2: Factorization",
    "vector<int> get_factors(int x) {",
    "    vector<int> factors;",
    "    while (x != 1) {",
    "        factors.push_back(spf[x]);",
    "        x = x / spf[x];",
    "    }",
    "    return factors;",
    "}"
];

function* buildSpfSteps() {
    let spf = new Array(MAX_N + 1).fill(undefined);
    let ops = 0;
    
    yield { phase: 1, line: -1, spf: [...spf], i: null, j: null, msg: "Press Arrow Down or click 'Next' to build SPF array.", ops };
    yield { phase: 1, line: 4, spf: [...spf], i: null, j: null, msg: "Calling build_spf().", ops };
    
    for (let k = 1; k <= MAX_N; k++) spf[k] = k;
    yield { phase: 1, line: 5, spf: [...spf], i: null, j: null, msg: "Initialized spf[i] = i for all elements.", ops };
    
    for (let i = 2; i * i <= MAX_N; i++) {
        yield { phase: 1, line: 6, spf: [...spf], i, j: null, msg: `Outer loop: i = ${i}.`, ops };
        yield { phase: 1, line: 7, spf: [...spf], i, j: null, msg: `Check if spf[${i}] == ${i}.`, ops };
        
        if (spf[i] === i) {
            let startJ = i * i;
            yield { phase: 1, line: 8, spf: [...spf], i, j: null, msg: `spf[${i}] is ${i}, starting inner loop at j = ${startJ}.`, ops };
            
            for (let j = startJ; j <= MAX_N; j += i) {
                yield { phase: 1, line: 8, spf: [...spf], i, j, msg: `Inner loop: j = ${j}.`, ops };
                yield { phase: 1, line: 9, spf: [...spf], i, j, msg: `Check if spf[${j}] == ${j}.`, ops };
                ops++;
                if (spf[j] === j) {
                    spf[j] = i;
                    yield { phase: 1, line: 9, spf: [...spf], i, j, msg: `Set spf[${j}] = ${i}.`, ops };
                } else {
                     yield { phase: 1, line: 9, spf: [...spf], i, j, msg: `spf[${j}] is already ${spf[j]}, skipping.`, ops };
                }
            }
        } else {
            yield { phase: 1, line: 7, spf: [...spf], i, j: null, msg: `spf[${i}] is not ${i}, skipping inner loop.`, ops };
        }
    }
    yield { phase: 1, line: 12, spf: [...spf], i: null, j: null, msg: "Phase 1 Complete! SPF Array Built. Ready for factorization.", ops };
}

function* getFactorsSteps(initialX: number, currentSpfArray: any[], initialOps: number) {
    let x = Math.floor(initialX);
    let factors: number[] = [];
    let ops = initialOps;
    
    if (x < 1 || x > MAX_N) {
        yield { phase: 2, line: 16, x: null, nextX: null, factors: [], msg: `Invalid input.`, ops };
        return;
    }
    
    yield { phase: 2, line: -1, x, nextX: null, factors: [...factors], msg: `Starting factorization for ${initialX}.`, ops };
    yield { phase: 2, line: 16, x, nextX: null, factors: [...factors], msg: `Function get_factors(${initialX}) called.`, ops };
    yield { phase: 2, line: 17, x, nextX: null, factors: [...factors], msg: `Initialized empty factors vector.`, ops };
    
    if (x === 1) {
        yield { phase: 2, line: 18, x, nextX: null, factors: [...factors], msg: `Check if x (${x}) != 1. False.`, ops };
        yield { phase: 2, line: 22, x, nextX: null, factors: [...factors], msg: `Return factors: [${factors.join(", ")}].`, ops };
        return;
    }

    let loopCounter = 0;
    while (x !== 1 && loopCounter < 100) {
        loopCounter++;
        yield { phase: 2, line: 18, x, nextX: null, factors: [...factors], msg: `Check if x (${x}) != 1. True.`, ops };
        
        let p = currentSpfArray[x];
        
        if (!p || p < 2) {
             yield { phase: 2, line: 18, x, nextX: null, factors: [...factors], msg: `Error: Invalid SPF array value for ${x}. Terminating safely.`, ops };
             break;
        }

        factors.push(p);
        yield { phase: 2, line: 19, x, nextX: null, factors: [...factors], currentFactor: p, msg: `factors.push_back(spf[${x}]) -> pushed ${p}.`, ops };
        
        let nextX = Math.floor(x / p);
        yield { phase: 2, line: 20, x, nextX, factors: [...factors], currentFactor: p, msg: `x = ${x} / ${p} = ${nextX}.`, ops };
        x = nextX;
    }
    
    yield { phase: 2, line: 18, x, nextX: null, factors: [...factors], msg: `Check if x (${x}) != 1. False.`, ops };
    yield { phase: 2, line: 22, x, nextX: null, factors: [...factors], msg: `Return factors: [${factors.join(", ")}].`, ops };
}

export function SpfPage() {
    const [phase1Steps, setPhase1Steps] = useState<any[]>([]);
    const [phase2Steps, setPhase2Steps] = useState<any[]>([]);
    const [stepIndex, setStepIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");

    const reset = useCallback(() => {
        setPhase1Steps(Array.from(buildSpfSteps()));
        setPhase2Steps([]);
        setStepIndex(0);
        setInputValue("");
    }, []);

    useEffect(() => {
        reset();
    }, [reset]);

    const startPhase2 = (num: number) => {
        if (num < 1 || num > MAX_N || phase1Steps.length === 0) return;
        const finalP1State = phase1Steps[phase1Steps.length - 1];
        const p2Steps = Array.from(getFactorsSteps(num, finalP1State.spf, finalP1State.ops));
        setPhase2Steps(p2Steps);
        setStepIndex(phase1Steps.length); // Jump to first step of phase 2
    };

    const totalSteps = phase1Steps.length + phase2Steps.length;
    const isPhase1 = stepIndex < phase1Steps.length;
    
    const defaultP1State = {
        phase: 1, line: -1, spf: new Array(MAX_N + 1).fill(undefined), i: null, j: null, msg: "Loading...", ops: 0, factors: [], x: null, nextX: null
    };
    
    const currentState = isPhase1 
        ? (phase1Steps[stepIndex] || defaultP1State) 
        : (phase2Steps[stepIndex - phase1Steps.length] || defaultP1State);

    const isPhase1Done = stepIndex >= phase1Steps.length - 1;
    const isPhase2Done = !isPhase1 && stepIndex === totalSteps - 1;

    const stepForward = useCallback(() => {
        setStepIndex(prev => Math.min(prev + 1, totalSteps - 1));
    }, [totalSteps]);

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

    const getCellStyles = (num: number) => {
        if (currentState.phase === 1) {
            if (currentState.j === num) return "bg-rose-500 text-white border-rose-400 shadow-[0_0_15px_rgba(243,64,64,0.5)] z-10 scale-105";
            if (currentState.i === num) return "bg-amber-500 text-amber-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10 scale-105";
            if (currentState.spf[num] !== undefined && currentState.spf[num] !== num) return "bg-emerald-900/50 text-emerald-300 border-emerald-700/50 shadow-inner";
            if (currentState.spf[num] !== undefined) return "bg-slate-700 text-slate-200 border-slate-600";
            return "bg-slate-800/80 text-slate-500 border-slate-700 border-dashed";
        } else {
            if (currentState.x === num) return "bg-indigo-500 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.6)] z-20 scale-110";
            if (currentState.nextX === num) return "bg-emerald-500 text-emerald-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10 scale-105";
            return "bg-slate-800/80 text-slate-500 border-slate-700 opacity-60";
        }
    };

    return (
        <div className="flex-grow p-6 flex flex-col gap-6 max-w-[1600px] mx-auto w-full z-10">
            {/* Top Area: Controls & Statistics */}
            <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <button 
                            onClick={stepForward}
                            disabled={stepIndex === totalSteps - 1 || totalSteps === 0}
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
                            title="Reset All"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>

                        {/* Phase 2 Input Section */}
                        <div className="flex items-center gap-2 border-l border-slate-700 pl-3 ml-1">
                            <input 
                                type="number" 
                                min="1" 
                                max={MAX_N} 
                                value={inputValue} 
                                onChange={(e) => setInputValue(e.target.value)} 
                                disabled={!isPhase1Done}
                                className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 w-40 font-mono transition-all"
                                placeholder={`Number (1-${MAX_N})`}
                            />
                            <button 
                                disabled={!isPhase1Done || !inputValue || parseInt(inputValue) < 1 || parseInt(inputValue) > MAX_N}
                                onClick={() => startPhase2(parseInt(inputValue))}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/10"
                            >
                                <Zap className="w-4 h-4" />
                                Factorize
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-3 shadow-inner">
                            <Activity className="w-4 h-4 text-emerald-400" />
                            <div className="text-sm text-slate-400">Build Time:</div>
                            <div className="text-sm font-mono text-emerald-400 font-semibold">O(N log log N)</div>
                        </div>
                        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-3 shadow-inner">
                            <div className="text-sm text-slate-400">Query Time:</div>
                            <div className="text-sm font-mono text-amber-400 font-semibold">O(log N)</div>
                        </div>
                    </div>
                </div>

                <div className={`p-3 rounded-xl flex items-center gap-3 shadow-inner border ${currentState.phase === 1 ? 'bg-amber-950/30 border-amber-500/30 text-amber-200' : 'bg-indigo-950/50 border-indigo-500/30 text-indigo-200'}`}>
                    <div className={`p-1.5 rounded-full flex-shrink-0 ${(isPhase1Done && isPhase1) || isPhase2Done ? 'bg-emerald-500/20 text-emerald-400' : (currentState.phase === 1 ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400')}`}>
                        {((isPhase1Done && isPhase1) || isPhase2Done) ? <Check className="w-4 h-4" /> : <Play className="w-4 h-4 animate-pulse" />}
                    </div>
                    <span className="font-mono text-sm leading-relaxed">{currentState.msg}</span>
                </div>
            </div>

            {/* Main Area: Strict Side-by-Side Flex Layout */}
            <div className="flex flex-row flex-nowrap w-full flex-grow items-stretch gap-6 min-h-[600px] overflow-hidden">
                {/* Left Side: Visualization Canvas (50%) */}
                <div className="w-1/2 flex-1 min-w-0 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative flex flex-col overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <h2 className="text-xl font-bold mb-6 text-slate-200 z-10 flex items-center justify-between flex-shrink-0">
                        <span>Visualization Canvas</span>
                        <span className={`text-xs px-3 py-1 rounded-full border ${currentState.phase === 1 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
                            {currentState.phase === 1 ? 'Phase 1: Build Array' : 'Phase 2: Factorization'}
                        </span>
                    </h2>
                    
                    {/* 8x5 Grid Container */}
                    <div className="flex-grow flex items-center justify-center z-10 w-full overflow-x-auto">
                        <div className="grid gap-3 lg:gap-4 min-w-[500px] p-2" style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
                            {Array.from({ length: MAX_N }, (_, idx) => {
                                const num = idx + 1;
                                return (
                                    <div 
                                        key={num} 
                                        className={`
                                            flex flex-col items-center justify-center 
                                            h-14 lg:h-16 xl:h-20 
                                            rounded-xl transition-all duration-300 border 
                                            ${getCellStyles(num)}
                                        `}
                                    >
                                        <div className="text-base lg:text-lg xl:text-xl font-bold">{num}</div>
                                        <div className="text-[9px] lg:text-[10px] xl:text-xs font-mono mt-0.5 px-1.5 py-0.5 rounded bg-black/30 text-white/80 whitespace-nowrap">
                                            spf: {currentState.spf && currentState.spf[num] !== undefined ? currentState.spf[num] : '-'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Legend / Path Visualization Area */}
                    <div className="mt-6 pt-4 border-t border-slate-800 z-10 w-full flex-shrink-0 min-h-[100px]">
                        {currentState.phase === 1 ? (
                            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs xl:text-sm font-medium text-slate-300 h-full items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-slate-700 border border-slate-600 rounded"></div> spf[i] = i
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-emerald-900/50 border border-emerald-700/50 rounded"></div> spf updated
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-amber-500 border border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)] rounded"></div> Current (i)
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-rose-500 border border-rose-400 shadow-[0_0_8px_rgba(243,64,64,0.5)] rounded"></div> Multiple (j)
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-950 border border-indigo-500/30 rounded-xl p-4 shadow-inner flex flex-col gap-2">
                                <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                                    <ListTree className="w-4 h-4" /> 
                                    Prime Factors Extracted
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="text-slate-400 font-mono text-lg">factors =</div>
                                    <div className="flex items-center text-lg font-mono text-emerald-400 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 flex-grow min-h-[44px]">
                                        <span className="text-slate-500 mr-2">[</span>
                                        {currentState.factors && currentState.factors.length > 0 ? (
                                            currentState.factors.map((f: number, i: number) => (
                                                <React.Fragment key={i}>
                                                    <span className="text-emerald-400 font-bold">{f}</span>
                                                    {i < currentState.factors.length - 1 && <span className="text-slate-600 mx-1">,</span>}
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <span className="text-slate-700 italic text-sm">waiting...</span>
                                        )}
                                        <span className="text-slate-500 ml-2">]</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: C++ Code Tracker (50%) */}
                <div className="w-1/2 flex-1 min-w-0 bg-[#0f111a] border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl font-mono text-[13px]">
                    <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-slate-400 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4" />
                            <span>spf.cpp</span>
                        </div>
                        <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-500">C++</span>
                    </div>
                    <div className="py-4 overflow-y-auto flex-grow">
                        {C_CODE_LINES_SPF.map((line, idx) => {
                            const isActive = currentState.line === idx;
                            return (
                                <div 
                                    key={idx} 
                                    className={`px-4 py-1 flex transition-colors duration-150 ${
                                        isActive 
                                            ? (currentState.phase === 1 ? 'bg-amber-500/20 border-l-4 border-amber-500 text-amber-100' : 'bg-indigo-500/20 border-l-4 border-indigo-500 text-indigo-100')
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