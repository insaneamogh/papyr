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
    // Elegant light tag styling
    const getTagColor = (tag: string) => {
        const t = tag.toLowerCase();
        if (t === "cv" || t.includes("vision")) return "bg-green-50 text-green-700 border-green-200";
        if (t === "nlp" || t.includes("language")) return "bg-blue-50 text-blue-700 border-blue-200";
        if (t === "transformer" || t === "attention") return "bg-purple-50 text-purple-700 border-purple-200";
        if (t === "gan" || t === "vae" || t === "generation") return "bg-rose-50 text-rose-700 border-rose-200";
        return "bg-gray-50 text-gray-600 border-gray-200";
    };

    return (
        <Link href={`/papers/${slug}`}>
            <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="h-full border border-gray-100 bg-white shadow-sm rounded-[2rem] p-8 flex flex-col hover:shadow-md transition-all cursor-pointer group"
            >
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                    <span className="text-xs font-semibold text-gray-500 border border-gray-200 rounded-full px-3 py-1 bg-gray-50">
                        {year}
                    </span>
                    {tags.map((tag) => (
                        <span key={tag} className={`text-xs font-semibold border rounded-full px-3 py-1 ${getTagColor(tag)}`}>
                            {tag}
                        </span>
                    ))}
                    <div className="ml-auto flex items-center text-gray-400 group-hover:text-black transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
                        <span className="ml-1 text-sm font-semibold">{task_count}</span>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-black mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                    {title}
                </h3>

                <p className="text-sm font-medium text-gray-400 mb-6 line-clamp-1">
                    {authors}
                </p>

                <p className="text-base text-gray-500 leading-relaxed max-h-[4.5rem] overflow-hidden line-clamp-3 mt-auto">
                    {description}
                </p>
            </motion.div>
        </Link>
    );
}
