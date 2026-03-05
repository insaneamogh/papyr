import Link from "next/link";
import { motion } from "framer-motion";

interface PaperCardProps {
    slug: string;
    title: string;
    year: number;
    authors: string;
    tags: string[];
    description: string;
    task_count: number;
}

export default function PaperCard({ slug, title, year, authors, tags, description, task_count }: PaperCardProps) {
    // Simple mapping for tag colors
    const getTagColor = (tag: string) => {
        const t = tag.toLowerCase();
        if (t === "cv" || t.includes("vision")) return "bg-green-900/30 text-green-400 border-green-800";
        if (t === "nlp" || t.includes("language")) return "bg-blue-900/30 text-blue-400 border-blue-800";
        if (t === "transformer" || t === "attention") return "bg-purple-900/30 text-purple-400 border-purple-800";
        if (t === "gan" || t === "vae" || t === "generation") return "bg-red-900/30 text-red-400 border-red-800";
        return "bg-gray-800 text-gray-300 border-gray-700";
    };

    return (
        <Link href={`/papers/${slug}`}>
            <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="h-full border border-gray-800 bg-[#0a0a0a] rounded-xl p-6 flex flex-col hover:border-gray-600 transition-colors cursor-pointer group"
            >
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="text-xs font-mono text-gray-400 border border-gray-800 rounded px-2 py-1">
                        {year}
                    </span>
                    {tags.map((tag) => (
                        <span key={tag} className={`text-xs font-medium border rounded px-2 py-1 ${getTagColor(tag)}`}>
                            {tag}
                        </span>
                    ))}
                    <div className="ml-auto flex items-center text-gray-500 group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
                        <span className="ml-1 text-xs font-mono">{task_count}</span>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">
                    {title}
                </h3>

                <p className="text-sm font-mono text-gray-500 mb-4 line-clamp-1">
                    {authors}
                </p>

                <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mt-auto">
                    {description}
                </p>
            </motion.div>
        </Link>
    );
}
