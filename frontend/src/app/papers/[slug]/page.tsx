import Navbar from "@/components/Navbar";
import TaskCard from "@/components/TaskCard";
import { fetchPaperDetail } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Params {
    params: Promise<{ slug: string }>;
}

export default async function PaperDetailPage(props: Params) {
    const params = await props.params;
    let paper;
    try {
        paper = await fetchPaperDetail(params.slug);
    } catch (e) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 pb-24">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                {/* Back Link */}
                <Link href="/papers" className="inline-flex items-center text-sm font-semibold text-gray-400 hover:text-black transition-colors mb-10">
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Papers
                </Link>

                {/* Header */}
                <div className="mb-16">
                    <h1 className="text-5xl sm:text-6xl font-bold tracking-tighter mb-6 leading-tight text-black">
                        {paper.title}
                    </h1>
                    <div className="flex items-center gap-3 mb-8 flex-wrap">
                        <span className="text-sm font-semibold text-gray-600 border border-gray-200 rounded-full px-4 py-1.5 bg-gray-50 shadow-sm">
                            {paper.year}
                        </span>
                        <span className="text-sm font-semibold text-gray-500 px-2">
                            {paper.authors}
                        </span>
                        {paper.original_url && (
                            <a href={paper.original_url} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center text-sm font-semibold border border-gray-200 bg-white hover:bg-gray-50 px-4 py-1.5 rounded-full text-gray-600 shadow-sm transition-all focus:ring-2 focus:ring-gray-200">
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                Read Original
                            </a>
                        )}
                    </div>
                    <p className="text-gray-500 text-lg sm:text-xl leading-relaxed font-medium">
                        {paper.description}
                    </p>
                </div>

                {/* Implementation Track */}
                <div>
                    <div className="flex items-center gap-4 mb-10">
                        <h2 className="text-3xl font-bold text-black tracking-tight">Implementation Track</h2>
                        <span className="text-sm font-bold text-gray-700 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full shadow-sm">
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
