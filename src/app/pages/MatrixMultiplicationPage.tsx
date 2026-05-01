import React, { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, ChevronDown, ChevronUp, Activity, Hash, Check, Grid3X3, Shuffle } from 'lucide-react';

const C_CODE_LINES = [
    "// A is N x M, B is M x P, C is N x P",
    "for(int i = 0; i < N; i++) {",
    "    for(int j = 0; j < P; j++) {",
    "        C[i][j] = 0;",
    "        for(int k = 0; k < M; k++) {",
    "            C[i][j] += A[i][k] * B[k][j];",
    "        }",
    "    }",
    "}"
];

const cloneMatrix = (matrix: any[][]) => matrix.map(row => [...row]);

function* buildMatrixSteps(A: number[][], B: number[][], N: number, M: number, P: number) {
    let C = Array.from({length: N}, () => new Array(P).fill(undefined));
    let ops = 0;
    
    yield { line: -1, C: cloneMatrix(C), i: null, j: null, k: null, msg: "Press Arrow Down or click 'Step' to begin.", ops };

    for(let i = 0; i < N; i++) {
        yield { line: 1, C: cloneMatrix(C), i, j: null, k: null, msg: `Outer loop: i = ${i}`, ops };
        for(let j = 0; j < P; j++) {
            yield { line: 2, C: cloneMatrix(C), i, j, k: null, msg: `Middle loop: j = ${j}`, ops };
            C[i][j] = 0;
            yield { line: 3, C: cloneMatrix(C), i, j, k: null, msg: `Initialize C[${i}][${j}] = 0`, ops };
            
            for(let k = 0; k < M; k++) {
                yield { line: 4, C: cloneMatrix(C), i, j, k, msg: `Inner loop: k = ${k}`, ops };
                ops++;
                C[i][j] += A[i][k] * B[k][j];
                yield { line: 5, C: cloneMatrix(C), i, j, k, msg: `C[${i}][${j}] += A[${i}][${k}] * B[${k}][${j}]  ->  C[${i}][${j}] = ${C[i][j]}`, ops };
            }
            yield { line: 6, C: cloneMatrix(C), i, j, k: null, msg: `Finished inner loop for C[${i}][${j}]`, ops };
        }
        yield { line: 7, C: cloneMatrix(C), i, j: null, k: null, msg: `Finished middle loop for row i = ${i}`, ops };
    }
    yield { line: 8, C: cloneMatrix(C), i: null, j: null, k: null, msg: "Matrix multiplication complete!", ops };
}

export function MatrixMultiplicationPage() {
    const [N, setN] = useState(3);
    const [M, setM] = useState(2);
    const [P, setP] = useState(3);

    const generateRandomMatrix = useCallback((rows: number, cols: number) => {
        return Array.from({length: rows}, () => 
            Array.from({length: cols}, () => Math.floor(Math.random() * 9) + 1)
        );
    }, []);

    const [A, setA] = useState<number[][]>(() => generateRandomMatrix(3, 2));
    const [B, setB] = useState<number[][]>(() => generateRandomMatrix(2, 3));

    const [steps, setSteps] = useState<any[]>([]);
    const [stepIndex, setStepIndex] = useState(0);

    const reset = useCallback((overrideA?: number[][], overrideB?: number[][], currN?: number, currM?: number, currP?: number) => {
        const actualA = overrideA || A;
        const actualB = overrideB || B;
        const actualN = currN || N;
        const actualM = currM || M;
        const actualP = currP || P;

        setSteps(Array.from(buildMatrixSteps(actualA, actualB, actualN, actualM, actualP)));
        setStepIndex(0);
    }, [A, B, N, M, P]);

    useEffect(() => {
        reset();
    }, [reset]);

    const handleGenerate = () => {
        const newA = generateRandomMatrix(N, M);
        const newB = generateRandomMatrix(M, P);
        setA(newA);
        setB(newB);
        reset(newA, newB, N, M, P);
    };

    const handleDimensionChange = (dim: 'N'|'M'|'P', val: number) => {
        const newVal = Math.min(5, Math.max(1, isNaN(val) ? 1 : val));
        let newN = N, newM = M, newP = P;
        if (dim === 'N') { setN(newVal); newN = newVal; }
        if (dim === 'M') { setM(newVal); newM = newVal; }
        if (dim === 'P') { setP(newVal); newP = newVal; }
        
        const newA = generateRandomMatrix(newN, newM);
        const newB = generateRandomMatrix(newM, newP);
        setA(newA);
        setB(newB);
        reset(newA, newB, newN, newM, newP);
    };

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
        C: Array.from({length: 3}, () => new Array(3).fill(undefined)),
        i: null,
        j: null,
        k: null,
        ops: 0,
        msg: "Loading..."
    };

    const isDone = steps.length > 0 && stepIndex === steps.length - 1;

    const getACellStyle = (r: number, c: number) => {
        if (state.i === r && state.k === c) return "bg-amber-500 text-amber-950 font-bold border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] z-20 scale-110";
        if (state.i === r && state.j !== null) return "bg-amber-500/20 text-amber-200 border-amber-500/50 z-10";
        return "bg-slate-800 text-slate-300 border-slate-700";
    }

    const getBCellStyle = (r: number, c: number) => {
        if (state.k === r && state.j === c) return "bg-rose-500 text-white font-bold border-rose-400 shadow-[0_0_15px_rgba(243,64,64,0.5)] z-20 scale-110";
        if (state.j === c && state.i !== null) return "bg-rose-500/20 text-rose-200 border-rose-500/50 z-10";
        return "bg-slate-800 text-slate-300 border-slate-700";
    }

    const getCCellStyle = (r: number, c: number) => {
        if (state.i === r && state.j === c && state.k !== null) return "bg-emerald-500 text-emerald-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20 scale-105 font-bold";
        if (state.i === r && state.j === c) return "bg-emerald-500/50 text-white border-emerald-400 z-10 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]";
        if (state.C && state.C[r] && state.C[r][c] !== undefined) return "bg-slate-700 text-slate-200 border-slate-600 font-bold";
        return "bg-slate-800/40 text-slate-500 border-slate-700 border-dashed";
    }

    return (
        <div className="flex-grow p-6 flex flex-col gap-6 max-w-[1600px] mx-auto w-full z-10">
            {/* Top Area: Controls & Statistics */}
            <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
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
                            onClick={() => reset()}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-3 rounded-xl font-medium transition-colors border border-slate-700"
                            title="Reset"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>

                        <div className="h-8 w-px bg-slate-700 mx-1 hidden sm:block"></div>

                        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                            <div className="flex items-center gap-2 px-2">
                                <span className="text-slate-400 text-sm font-mono">N:</span>
                                <input type="number" min="1" max="5" value={N} onChange={e => handleDimensionChange('N', parseInt(e.target.value))} className="w-12 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-center outline-none focus:border-indigo-500" />
                            </div>
                            <div className="flex items-center gap-2 px-2 border-l border-slate-800">
                                <span className="text-slate-400 text-sm font-mono">M:</span>
                                <input type="number" min="1" max="5" value={M} onChange={e => handleDimensionChange('M', parseInt(e.target.value))} className="w-12 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-center outline-none focus:border-indigo-500" />
                            </div>
                            <div className="flex items-center gap-2 px-2 border-l border-slate-800">
                                <span className="text-slate-400 text-sm font-mono">P:</span>
                                <input type="number" min="1" max="5" value={P} onChange={e => handleDimensionChange('P', parseInt(e.target.value))} className="w-12 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-center outline-none focus:border-indigo-500" />
                            </div>
                        </div>

                        <button 
                            onClick={handleGenerate}
                            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-3 rounded-xl font-medium transition-colors border border-slate-700"
                        >
                            <Shuffle className="w-4 h-4 text-indigo-400" />
                            Randomize
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
                            <div className="text-sm font-mono text-emerald-400 font-semibold">O(N × M × P)</div>
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
                        <Grid3X3 className="w-5 h-5 text-indigo-400" />
                        Visualization Canvas
                    </h2>
                    
                    <div className="flex-grow flex flex-col justify-center gap-8 z-10 w-full overflow-x-auto overflow-y-auto pr-2 custom-scrollbar">
                        
                        {/* Matrices A and B Side by Side */}
                        <div className="flex flex-row justify-center items-center gap-4 sm:gap-8 min-w-max">
                            
                            {/* Matrix A */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="text-sm font-semibold text-slate-400 mb-1 flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-sm bg-amber-500/20 border border-amber-500/50"></div>
                                    Matrix A ({N} × {M})
                                </div>
                                <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 inline-block">
                                    <div className="flex flex-col gap-2">
                                        {A.map((row, r) => (
                                            <div key={r} className="flex gap-2">
                                                {row.map((val, c) => (
                                                    <div 
                                                        key={`${r}-${c}`} 
                                                        className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg border transition-all duration-300 text-sm sm:text-base ${getACellStyle(r, c)}`}
                                                    >
                                                        {val}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="text-slate-500 text-xl font-bold">×</div>

                            {/* Matrix B */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="text-sm font-semibold text-slate-400 mb-1 flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-sm bg-rose-500/20 border border-rose-500/50"></div>
                                    Matrix B ({M} × {P})
                                </div>
                                <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 inline-block">
                                    <div className="flex flex-col gap-2">
                                        {B.map((row, r) => (
                                            <div key={r} className="flex gap-2">
                                                {row.map((val, c) => (
                                                    <div 
                                                        key={`${r}-${c}`} 
                                                        className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg border transition-all duration-300 text-sm sm:text-base ${getBCellStyle(r, c)}`}
                                                    >
                                                        {val}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="flex justify-center text-slate-500 text-xl font-bold mt-2 min-w-max">=</div>

                        {/* Matrix C */}
                        <div className="flex flex-col items-center gap-2 mt-2 pb-4 min-w-max">
                            <div className="text-sm font-semibold text-slate-400 mb-1 flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/50"></div>
                                Matrix C ({N} × {P})
                            </div>
                            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 inline-block shadow-lg">
                                <div className="flex flex-col gap-2">
                                    {state.C.map((row, r) => (
                                        <div key={`c-${r}`} className="flex gap-2">
                                            {row.map((val, c) => (
                                                <div 
                                                    key={`c-${r}-${c}`} 
                                                    className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg border transition-all duration-300 text-base sm:text-lg ${getCCellStyle(r, c)}`}
                                                >
                                                    {val !== undefined ? val : "-"}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Side: C++ Code Tracker (50%) */}
                <div className="w-1/2 flex-1 min-w-0 bg-[#0f111a] border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl font-mono text-[13px]">
                    <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-slate-400 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4" />
                            <span>matrix_mult.cpp</span>
                        </div>
                        <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-500">C++</span>
                    </div>
                    <div className="py-4 overflow-y-auto flex-grow">
                        {C_CODE_LINES.map((line, idx) => {
                            const isActive = state.line === idx;
                            return (
                                <div 
                                    key={idx} 
                                    className={`px-4 py-1.5 flex transition-colors duration-150 ${
                                        isActive 
                                            ? 'bg-indigo-500/20 border-l-4 border-indigo-500 text-indigo-100' 
                                            : 'border-l-4 border-transparent text-slate-400'
                                    }`}
                                >
                                    <span className="text-slate-600 select-none w-8 inline-block text-right pr-4 border-r border-slate-800 mr-4 flex-shrink-0">
                                        {idx}
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