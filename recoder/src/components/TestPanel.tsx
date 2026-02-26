import React, { useState, useEffect } from 'react';
import { ValidationResult } from '../lib/validation';
import { Challenge } from '../lib/challenges';

interface TestPanelProps {
    challenge: Challenge;
    validationResult: ValidationResult | null;
}

export function TestPanel({ challenge, validationResult }: TestPanelProps) {
    const [activeTab, setActiveTab] = useState<"testcase" | "result">("testcase");
    const [activeCaseIndex, setActiveCaseIndex] = useState(0);

    // Automatically switch to result tab when there's a new result
    useEffect(() => {
        if (validationResult) {
            setActiveTab("result");
            // If overall didn't pass, find the first failed case and select it
            if (!validationResult.success && validationResult.results) {
                const firstFailed = validationResult.results.findIndex(r => !r.passed);
                if (firstFailed !== -1) {
                    setActiveCaseIndex(firstFailed);
                }
            } else {
                // If all passed or error, remain on the current case or reset
                setActiveCaseIndex(0);
            }
        }
    }, [validationResult]);

    // Extract parameter names from the buggyCode for nicer display
    const getParamNames = (code: string) => {
        const match = code.match(/function\s+[a-zA-Z0-9_]+\s*\(([^)]*)\)/);
        if (!match) return [];
        return match[1].split(',').map(s => s.trim()).filter(Boolean);
    };

    const paramNames = getParamNames(challenge.buggyCode);
    const testCases = challenge.testCases;

    const renderInputValues = (inputs: any[]) => {
        return inputs.map((val, idx) => {
            const paramName = paramNames[idx] || `param${idx + 1}`;
            const valueStr = JSON.stringify(val);
            return (
                <div key={idx} className="mb-4 last:mb-0">
                    <div className="text-sm text-slate-400 mb-1">{paramName} =</div>
                    <div className="w-full bg-[#2d2d2d] border border-slate-700/50 rounded-lg p-3 font-mono text-sm text-slate-200">
                        {valueStr}
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="w-full bg-[#1e1e1e] border border-slate-700 rounded-xl overflow-hidden shadow-xl text-slate-300">
            {/* Top Navigation */}
            <div className="flex items-center bg-[#2d2d2d] border-b border-slate-700">
                <button
                    onClick={() => setActiveTab("testcase")}
                    className={`px-4 py-3 text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === "testcase"
                            ? "bg-[#1e1e1e] text-slate-200 border-t-2 border-t-green-500"
                            : "text-slate-400 hover:text-slate-200 hover:bg-[#3e3e3e]/50 border-t-2 border-t-transparent"
                        }`}
                >
                    <span className="material-symbols-outlined text-[18px] text-green-500">check_box</span>
                    Testcase
                </button>
                <div className="w-px h-5 bg-slate-700 mx-2"></div>
                <button
                    onClick={() => setActiveTab("result")}
                    className={`px-4 py-3 text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === "result"
                            ? "bg-[#1e1e1e] text-slate-200 border-t-2 border-t-green-500"
                            : "text-slate-400 hover:text-slate-200 hover:bg-[#3e3e3e]/50 border-t-2 border-t-transparent"
                        }`}
                >
                    <span className="material-symbols-outlined text-[18px] text-green-500">terminal</span>
                    Test Result
                </button>
            </div>

            <div className="p-4">
                {/* Result header summary if on result tab */}
                {activeTab === "result" && validationResult && (
                    <div className="mb-6 flex items-center gap-4">
                        {validationResult.error ? (
                            <h2 className="text-2xl font-bold text-red-500 flex items-center gap-2">
                                Runtime Error
                            </h2>
                        ) : validationResult.success ? (
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-bold text-green-500 flex items-center gap-2">
                                    Accepted
                                </h2>
                                <span className="text-sm text-slate-400 mt-1">Runtime: 0 ms</span>
                            </div>
                        ) : (
                            <h2 className="text-2xl font-bold text-red-500 flex items-center gap-2">
                                Wrong Answer
                            </h2>
                        )}
                        {!validationResult.error && !validationResult.success && (
                            <span className="text-sm text-slate-500 mt-2 block">
                                {validationResult.passedCount} / {validationResult.totalCount} testcases passed
                            </span>
                        )}
                    </div>
                )}

                {/* Inner Tabs for Cases (only if no global compilation error) */}
                {(!validationResult || !validationResult.error) && (
                    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 slim-scrollbar">
                        {testCases.map((_, idx) => {
                            const isResultTab = activeTab === "result";
                            const hasResult = isResultTab && validationResult && validationResult.results[idx];
                            let statusIcon = null;

                            if (hasResult) {
                                const passed = validationResult.results[idx].passed;
                                statusIcon = passed ? (
                                    <span className="material-symbols-outlined text-[16px] text-green-500 mr-1.5">check_circle</span>
                                ) : (
                                    <span className="material-symbols-outlined text-[16px] text-red-500 mr-1.5">cancel</span>
                                );
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => setActiveCaseIndex(idx)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center whitespace-nowrap transition-all ${activeCaseIndex === idx
                                            ? "bg-[#3e3e3e] text-slate-200"
                                            : "text-slate-400 hover:bg-[#3e3e3e]/50 hover:text-slate-300"
                                        }`}
                                >
                                    {statusIcon}
                                    Case {idx + 1}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Content for the selected case */}
                <div className="mt-2">
                    {/* Compile error state */}
                    {activeTab === "result" && validationResult && validationResult.error ? (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 font-mono text-sm text-red-400 whitespace-pre-wrap">
                            {validationResult.error}
                        </div>
                    ) : (
                        <>
                            {activeTab === "testcase" && (
                                <div className="space-y-4">
                                    {renderInputValues(testCases[activeCaseIndex].input)}
                                </div>
                            )}

                            {activeTab === "result" && validationResult && validationResult.results[activeCaseIndex] && (
                                <div className="space-y-6">
                                    {/* Input */}
                                    <div>
                                        <div className="text-sm font-medium text-slate-400 mb-2">Input</div>
                                        <div className="space-y-4">
                                            {renderInputValues(validationResult.results[activeCaseIndex].input)}
                                        </div>
                                    </div>
                                    {/* Output */}
                                    <div>
                                        <div className="text-sm font-medium text-slate-400 mb-2">Output</div>
                                        <div className={`w-full bg-[#2d2d2d] border rounded-lg p-3 font-mono text-sm text-slate-200 ${validationResult.results[activeCaseIndex].passed
                                                ? 'border-slate-700/50'
                                                : 'border-red-500/40 bg-red-500/5 text-red-400'
                                            }`}>
                                            {validationResult.results[activeCaseIndex].error
                                                ? validationResult.results[activeCaseIndex].error
                                                : JSON.stringify(validationResult.results[activeCaseIndex].actual)}
                                        </div>
                                    </div>
                                    {/* Expected */}
                                    <div>
                                        <div className="text-sm font-medium text-slate-400 mb-2">Expected</div>
                                        <div className="w-full bg-[#2d2d2d] border border-slate-700/50 rounded-lg p-3 font-mono text-sm text-slate-200">
                                            {JSON.stringify(validationResult.results[activeCaseIndex].expected)}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "result" && (!validationResult || validationResult.results.length === 0) && (
                                <div className="text-slate-500 italic py-8 text-center bg-[#2d2d2d]/30 rounded-lg border border-slate-800">
                                    Run code to see test results
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .slim-scrollbar::-webkit-scrollbar {
                    height: 4px;
                }
                .slim-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .slim-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #4a4a4a;
                    border-radius: 20px;
                }
            `}} />
        </div>
    );
}
