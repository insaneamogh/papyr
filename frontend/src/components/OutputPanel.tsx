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
        <div className="h-full flex flex-col bg-[#f9fafb] border-t border-gray-200 font-mono text-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
                <span className="font-bold text-gray-700">Terminal Output</span>

                {status === "running" && (
                    <span className="flex items-center text-blue-600 text-xs font-semibold">
                        <span className="animate-pulse mr-2 h-2 w-2 bg-blue-500 rounded-full"></span>
                        Executing...
                    </span>
                )}
                {status === "success" && (
                    <span className="text-green-600 font-semibold text-xs flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        Success
                    </span>
                )}
                {status === "error" && (
                    <span className="text-red-600 font-semibold text-xs flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        Failed
                    </span>
                )}
            </div>

            {/* Test Results Summary (if available) */}
            {testResults && (
                <div className="px-6 py-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between mb-3">
                        <span className={`text-base font-bold ${testResults.failed === 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {testResults.failed === 0 ? 'All tests passed!' : `${testResults.failed} test(s) failed`}
                        </span>
                        <span className="text-gray-500 font-semibold text-xs">
                            {testResults.passed}/{testResults.total} Passed
                        </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden flex border border-gray-200">
                        <div
                            className="bg-green-500 h-full transition-all duration-500"
                            style={{ width: `${testResults.percentage}%` }}
                        ></div>
                        {testResults.failed > 0 && (
                            <div
                                className="bg-red-500 h-full transition-all duration-500"
                                style={{ width: `${100 - testResults.percentage}%` }}
                            ></div>
                        )}
                    </div>
                </div>
            )}

            {/* Console Output */}
            <div className="flex-1 overflow-auto p-6 bg-white text-gray-800">
                {output ? (
                    <pre className="whitespace-pre-wrap break-words leading-relaxed font-mono">{output}</pre>
                ) : (
                    <span className="text-gray-400 font-medium italic">No output yet. Run your code to see results.</span>
                )}
            </div>
        </div>
    );
}
