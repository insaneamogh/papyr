import Navbar from "@/components/Navbar";
import TaskCard from "@/components/TaskCard";
import { fetchPaperDetail } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Params {
    params: { slug: string };
}

export default async function PaperDetailPage({ params }: Params) {
    let paper;
    try {
        paper = await fetchPaperDetail(params.slug);
    } catch (e) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back Link */}
                <Link href="/papers" className="inline-flex items-center text-sm font-mono text-gray-400 hover:text-white transition-colors mb-8">
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Papers
                </Link>

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                        {paper.title}
                    </h1>
                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                        <span className="text-xs font-mono text-gray-400 border border-gray-800 rounded px-2 py-1 bg-[#111]">
                            {paper.year}
                        </span>
                        <span className="text-xs font-mono text-gray-400">
                            {paper.authors}
                        </span>
                        {paper.original_url && (
                            <a href={paper.original_url} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center text-xs font-mono border border-gray-700 hover:bg-gray-800 px-3 py-1.5 rounded text-gray-300 transition-colors">
                                <svg className="w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                Read Original
                            </a>
                        )}
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed font-mono">
                        {paper.description}
                    </p>
                </div>

                {/* Implementation Track */}
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-bold">Implementation Track</h2>
                        <span className="text-xs font-mono text-gray-400 bg-gray-900 border border-gray-800 px-2 py-1 rounded">
                            {paper.tasks.length} Tasks
                        </span>
                    </div>

                    <div className="space-y-4">
                        {paper.tasks.map((task: any, idx: number) => (
                            <TaskCard
                                key={task.id}
                                paperSlug={paper.slug}
                                taskId={task.id}
                                index={idx + 1}
                                title={task.title}
                                description={task.description}
                                difficulty={task.difficulty}
                                type={task.type}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
