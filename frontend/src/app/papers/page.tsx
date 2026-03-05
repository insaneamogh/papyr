"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import PaperCard from "@/components/PaperCard";
import { fetchPapers, importPaper } from "@/lib/api";
import { useRouter } from "next/navigation";

const TAGS = ["All", "CNN", "CV", "Embeddings", "Fine-tuning", "GAN", "Low-Rank", "NLP", "Parameter Efficiency", "Pre-training", "Representation Learning", "RNN", "Transformer", "VAE"];

export default function PapersPage() {
    const [papers, setPapers] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [activeTag, setActiveTag] = useState("All");
    const [loading, setLoading] = useState(true);

    // Import State
    const [importQuery, setImportQuery] = useState("");
    const [isImporting, setIsImporting] = useState(false);
    const [importMessage, setImportMessage] = useState("");
    const router = useRouter();

    const handleImport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!importQuery.trim()) return;

        setIsImporting(true);
        setImportMessage("Gathering ArXiv data and prompting OpenAI... this may take 15 seconds.");
        try {
            const res = await importPaper(importQuery);
            setImportMessage(`Success! Redirecting to ${res.paper_title}...`);
            router.push(`/papers/${res.slug}`);
        } catch (error: any) {
            setImportMessage("Failed to import. Make sure it's a valid ML paper title or ArXiv ID.");
            console.error(error);
            setIsImporting(false);
        }
    };

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const data = await fetchPapers(
                    search.length > 2 ? search : undefined,
                    activeTag !== "All" ? activeTag : undefined
                );
                setPapers(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        const timeoutId = setTimeout(load, 300);
        return () => clearTimeout(timeoutId);
    }, [search, activeTag]);

    return (
        <div className="min-h-screen bg-white text-gray-900 pb-24">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter mb-4 text-black">Papers</h1>
                <p className="text-xl text-gray-500 mb-12 font-medium">Select a paper to start implementing, or import a brand new one.</p>

                {/* ArXiv Importer */}
                <div className="bg-[#f9fafb] border border-gray-200 p-6 sm:p-8 rounded-[2rem] shadow-sm mb-12 max-w-3xl">
                    <h2 className="text-2xl font-black text-black mb-3">Auto-Ingest via ArXiv</h2>
                    <p className="text-gray-500 mb-6 font-medium">Paste an ArXiv link or paper name. OpenAI will synthesize coding micro-tasks automatically.</p>
                    <form onSubmit={handleImport} className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="e.g. https://arxiv.org/abs/1706.03762 or 'Transformer'"
                            className="flex-1 px-4 py-3 sm:py-4 border border-gray-200 rounded-2xl bg-white shadow-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all font-medium"
                            value={importQuery}
                            onChange={(e) => setImportQuery(e.target.value)}
                            disabled={isImporting}
                        />
                        <button
                            type="submit"
                            disabled={isImporting || !importQuery.trim()}
                            className="bg-black text-white px-8 py-3 sm:py-4 rounded-xl font-bold disabled:opacity-50 hover:bg-gray-800 transition-all whitespace-nowrap shadow-sm"
                        >
                            {isImporting ? "Importing..." : "Ingest Paper"}
                        </button>
                    </form>
                    {importMessage && (
                        <p className={`mt-4 text-sm font-semibold ${importMessage.includes("Success") ? "text-green-600" : "text-black animate-pulse"}`}>
                            {importMessage}
                        </p>
                    )}
                </div>

                {/* Search Bar */}
                <div className="relative mb-10 max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl bg-white shadow-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:text-base transition-all"
                        placeholder="Search papers, tags..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-16">
                    <span className="text-sm text-gray-400 mr-2 font-medium">Filter by:</span>
                    {TAGS.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTag === tag
                                ? "bg-black text-white border border-black shadow-md"
                                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {papers.map((paper) => (
                            <PaperCard key={paper.slug} {...paper} />
                        ))}
                        {papers.length === 0 && (
                            <div className="col-span-full text-center py-24 text-gray-500 font-medium">
                                No papers found matching your criteria.
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
