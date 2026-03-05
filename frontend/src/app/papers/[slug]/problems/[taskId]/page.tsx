"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import CodeEditor from "@/components/CodeEditor";
import OutputPanel from "@/components/OutputPanel";
import { fetchTaskDetail, runCode, submitCode } from "@/lib/api";

export default function ProblemPage() {
    const params = useParams();
    const slug = params.slug as string;
    const taskId = params.taskId as string;

    const [task, setTask] = useState<any>(null);
    const [code, setCode] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
    const [testResults, setTestResults] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<"description" | "output">("description");

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchTaskDetail(slug, taskId);
                setTask(data);
                setCode(data.boilerplate_code);
            } catch (e) {
                console.error(e);
            }
        }
        load();
    }, [slug, taskId]);

    const handleRun = async () => {
        setStatus("running");
        setActiveTab("output");
        setTestResults(null);
        try {
            const res = await runCode(code);
            setOutput(res.stdout + (res.stderr ? `\nErrors:\n${res.stderr}` : ''));
            setStatus(res.success ? "success" : "error");
        } catch (e: any) {
            setOutput(e.message);
            setStatus("error");
        }
    };

    const handleSubmit = async () => {
        setStatus("running");
        setActiveTab("output");
        try {
            const res = await submitCode(code, slug, taskId);
            setOutput(res.output);
            setTestResults({
                passed: res.passed,
                failed: res.failed,
                total: res.total,
                percentage: res.percentage
            });
            setStatus(res.success ? "success" : "error");
        } catch (e: any) {
            setOutput(e.message);
            setStatus("error");
        }
    };

    if (!task) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
            {/* Top Navbar */}
            <header className="h-14 border-b border-gray-800 bg-[#0a0a0a] flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href={`/papers/${slug}`} className="text-gray-400 hover:text-white transition-colors">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="font-bold text-sm sm:text-base truncate max-w-[200px] sm:max-w-md">
                            {task.title}
                        </h1>
                        <span className="text-xs font-mono text-gray-500 bg-gray-900 border border-gray-800 px-2 py-0.5 rounded hidden sm:inline-block">
                            {task.difficulty}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRun}
                        disabled={status === "running"}
                        className="flex items-center text-sm font-bold bg-[#111] hover:bg-gray-800 border border-gray-700 text-gray-300 px-4 py-1.5 rounded disabled:opacity-50 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                        Run
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={status === "running"}
                        className="flex items-center text-sm font-bold bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded disabled:opacity-50 transition-colors"
                    >
                        Submit
                    </button>
                </div>
            </header>

            {/* Main Split View */}
            <div className="flex-1 flex flex-col md:flex-row min-h-0">

                {/* Left Pane: Description & Output Tabs */}
                <div className="w-full md:w-1/2 flex flex-col border-r border-gray-800 bg-[#050505] min-h-0">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-800 bg-[#0a0a0a] shrink-0">
                        <button
                            onClick={() => setActiveTab("description")}
                            className={`px-6 py-3 text-sm font-mono transition-colors ${activeTab === 'description' ? 'text-white border-b-2 border-blue-500 bg-gray-900/50' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab("output")}
                            className={`px-6 py-3 text-sm font-mono transition-colors ${activeTab === 'output' ? 'text-white border-b-2 border-green-500 bg-gray-900/50' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Output
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-auto min-h-0">
                        {activeTab === "description" ? (
                            <div className="p-6 prose prose-invert prose-sm max-w-none font-mono">
                                <ReactMarkdown>{task.description}</ReactMarkdown>

                                <div className="mt-12 p-4 border border-gray-800 rounded-lg bg-black">
                                    <h3 className="text-gray-400 mb-2 mt-0">Constraints:</h3>
                                    <ul className="text-gray-300 mb-0">
                                        <li>Time Limit: {task.time_limit}s</li>
                                        <li>Language: Python 3</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <OutputPanel output={output} status={status} testResults={testResults} />
                        )}
                    </div>
                </div>

                {/* Right Pane: Code Editor */}
                <div className="w-full md:w-1/2 min-h-0">
                    <CodeEditor
                        value={code}
                        onChange={(val) => setCode(val || "")}
                        language="python"
                    />
                </div>
            </div>
        </div>
    );
}
