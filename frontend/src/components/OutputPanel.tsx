"use client";

interface OutputPanelProps {
    output: string;
    status: "idle" | "running" | "success" | "error";
    testResults?: {
        passed: number;
        failed: number;
        total: number;
        percentage: number;
    };
}

export default function OutputPanel({ output, status, testResults }: OutputPanelProps) {
    return (
        <div className="h-full flex flex-col bg-[#050505] border-t border-gray-800 font-mono text-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border-b border-gray-800">
                <span className="font-bold text-gray-300">Terminal Output</span>

                {status === "running" && (
                    <span className="flex items-center text-blue-400 text-xs">
                        <span className="animate-pulse mr-2 h-2 w-2 bg-blue-500 rounded-full"></span>
                        Executing...
                    </span>
                )}
                {status === "success" && (
                    <span className="text-green-400 text-xs flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Success
                    </span>
                )}
                {status === "error" && (
                    <span className="text-red-400 text-xs flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        Failed
                    </span>
                )}
            </div>

            {/* Test Results Summary (if available) */}
            {testResults && (
                <div className="px-4 py-3 border-b border-gray-800 bg-[#0a0a0a]">
                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-base font-bold ${testResults.failed === 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {testResults.failed === 0 ? 'All tests passed!' : `${testResults.failed} test(s) failed`}
                        </span>
                        <span className="text-gray-400 text-xs">
                            {testResults.passed}/{testResults.total} Passed
                        </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden flex">
                        <div
                            className="bg-green-500 h-1.5 transition-all duration-500"
                            style={{ width: `${testResults.percentage}%` }}
                        ></div>
                        {testResults.failed > 0 && (
                            <div
                                className="bg-red-500 h-1.5 transition-all duration-500"
                                style={{ width: `${100 - testResults.percentage}%` }}
                            ></div>
                        )}
                    </div>
                </div>
            )}

            {/* Console Output */}
            <div className="flex-1 overflow-auto p-4 bg-black text-gray-300">
                {output ? (
                    <pre className="whitespace-pre-wrap break-words">{output}</pre>
                ) : (
                    <span className="text-gray-600 italic">No output yet. Run your code to see results.</span>
                )}
            </div>
        </div>
    );
}
