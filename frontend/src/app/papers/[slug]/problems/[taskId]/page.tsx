"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import CodeEditor from "@/components/CodeEditor";
import OutputPanel from "@/components/OutputPanel";
import { fetchTaskDetail, runCode, submitCode, askTutor } from "@/lib/api";

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

    // AI Tutor State
    const [isTutorOpen, setIsTutorOpen] = useState(false);
    const [tutorQuery, setTutorQuery] = useState("");
    const [tutorResponse, setTutorResponse] = useState("");
    const [isAskingTutor, setIsAskingTutor] = useState(false);

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

    const handleAskTutor = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tutorQuery.trim()) return;

        setIsAskingTutor(true);
        setTutorResponse("");
        try {
            const res = await askTutor(code, tutorQuery, slug, taskId);
            setTutorResponse(res.hint);
        } catch (e: any) {
            setTutorResponse("Failed to reach the AI Tutor. Please try again.");
            console.error(e);
        } finally {
            setIsAskingTutor(false);
            setTutorQuery("");
        }
    };

    if (!task) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-white text-gray-900 overflow-hidden">
            {/* Top Navbar */}
            <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <Link href={`/papers/${slug}`} className="text-gray-500 hover:text-black transition-colors">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="font-bold text-black text-sm sm:text-base truncate max-w-[200px] sm:max-w-md">
                            {task.title}
                        </h1>
                        <span className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 px-3 py-0.5 rounded-full hidden sm:inline-block">
                            {task.difficulty}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRun}
                        disabled={status === "running"}
                        className="flex items-center text-sm font-bold bg-white hover:bg-gray-50 border border-gray-200 text-black px-4 py-1.5 rounded-full shadow-sm disabled:opacity-50 transition-all"
                    >
                        <svg className="w-4 h-4 mr-2 text-black" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                        Run
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={status === "running"}
                        className="flex items-center text-sm font-bold bg-black hover:bg-gray-800 text-white px-5 py-1.5 rounded-full shadow-sm disabled:opacity-50 transition-all"
                    >
                        Submit
                    </button>
                </div>
            </header>

            {/* Main Split View */}
            <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-white">

                {/* Left Pane: Description & Output Tabs */}
                <div className="w-full md:w-1/2 flex flex-col border-r border-gray-200 bg-[#f9fafb] min-h-0">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 bg-white shrink-0 px-2">
                        <button
                            onClick={() => setActiveTab("description")}
                            className={`px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'description' ? 'text-black border-black bg-gray-50/50' : 'text-gray-500 border-transparent hover:text-black hover:border-gray-200'}`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab("output")}
                            className={`px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'output' ? 'text-black border-black bg-gray-50/50' : 'text-gray-500 border-transparent hover:text-black hover:border-gray-200'}`}
                        >
                            Output
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-auto min-h-0 p-8">
                        {activeTab === "description" ? (
                            <div className="prose prose-sm max-w-none">
                                <ReactMarkdown>{task.description}</ReactMarkdown>

                                <div className="mt-12 p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
                                    <h3 className="text-black mb-3 mt-0 text-lg font-bold tracking-tight">Constraints</h3>
                                    <ul className="text-gray-600 mb-0 font-medium">
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
                <div className="w-full md:w-1/2 min-h-0 relative">
                    <CodeEditor
                        value={code}
                        onChange={(val) => setCode(val || "")}
                        language="python"
                    />

                    {/* AI Tutor Floating Button */}
                    <button
                        onClick={() => setIsTutorOpen(true)}
                        className="absolute bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all z-20 group"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Ask AI Tutor
                        </span>
                    </button>

                    {/* AI Tutor Modal Overlay */}
                    {isTutorOpen && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-30 flex items-center justify-center p-4">
                            <div className="bg-white border border-gray-200 shadow-2xl rounded-[2rem] w-full max-w-lg overflow-hidden flex flex-col max-h-[90%]">
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                    <h3 className="text-xl font-black flex items-center gap-2">
                                        <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                        AI Tutor
                                    </h3>
                                    <button onClick={() => setIsTutorOpen(false)} className="text-gray-400 hover:text-black">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                <div className="p-6 overflow-y-auto flex-1 bg-white">
                                    {tutorResponse ? (
                                        <div className="prose prose-sm prose-indigo">
                                            <ReactMarkdown>{tutorResponse}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4 text-indigo-600">
                                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <h4 className="font-bold text-gray-900 mb-2">Stuck on {task.title}?</h4>
                                            <p className="text-gray-500 text-sm font-medium">Ask me anything. I read your current code and the correct solution, and will guide you to the answer without spoiling it.</p>
                                        </div>
                                    )}
                                    {isAskingTutor && (
                                        <div className="flex items-center gap-3 text-indigo-600 font-bold mt-4 justify-center">
                                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 border-t border-gray-100 bg-gray-50">
                                    <form onSubmit={handleAskTutor} className="relative">
                                        <input
                                            type="text"
                                            value={tutorQuery}
                                            onChange={(e) => setTutorQuery(e.target.value)}
                                            placeholder="Why is it throwing a dimension error?"
                                            className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                                            disabled={isAskingTutor}
                                        />
                                        <button
                                            type="submit"
                                            disabled={isAskingTutor || !tutorQuery.trim()}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-1.5 rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
