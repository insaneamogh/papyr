"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import PaperCard from "@/components/PaperCard";
import { fetchPapers } from "@/lib/api";

const TAGS = ["All", "CNN", "CV", "Embeddings", "Fine-tuning", "GAN", "Low-Rank", "NLP", "Parameter Efficiency", "Pre-training", "Representation Learning", "RNN", "Transformer", "VAE"];

export default function PapersPage() {
    const [papers, setPapers] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [activeTag, setActiveTag] = useState("All");
    const [loading, setLoading] = useState(true);

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
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">Papers</h1>
                <p className="text-gray-400 mb-8 font-mono">Select a paper to start implementing.</p>

                {/* Search Bar */}
                <div className="relative mb-8 max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-800 rounded-lg bg-[#0a0a0a] text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600 focus:border-gray-600 sm:text-sm font-mono transition-colors"
                        placeholder="Search papers, tags..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-12">
                    <span className="text-sm text-gray-500 mr-2 font-mono">Filter by:</span>
                    {TAGS.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag)}
                            className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${activeTag === tag
                                    ? "bg-white text-black border border-white"
                                    : "bg-[#111] text-gray-400 border border-gray-800 hover:bg-gray-800 hover:text-gray-200"
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {papers.map((paper) => (
                            <PaperCard key={paper.slug} {...paper} />
                        ))}
                        {papers.length === 0 && (
                            <div className="col-span-full text-center py-20 text-gray-500 font-mono">
                                No papers found matching your criteria.
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
