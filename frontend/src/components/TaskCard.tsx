import Link from "next/link";

interface TaskCardProps {
    paperSlug: string;
    taskId: string;
    index: number;
    title: string;
    description: string;
    difficulty: string;
    type: string;
}

export default function TaskCard({ paperSlug, taskId, index, title, description, difficulty, type }: TaskCardProps) {
    const diffColor =
        difficulty.toLowerCase() === "easy" ? "text-green-400 bg-green-900/20 border-green-800" :
            difficulty.toLowerCase() === "medium" ? "text-yellow-400 bg-yellow-900/20 border-yellow-800" :
                "text-red-400 bg-red-900/20 border-red-800";

    return (
        <Link href={`/papers/${paperSlug}/problems/${taskId}`}>
            <div className="border border-gray-800 bg-[#0a0a0a] rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:border-gray-600 transition-colors group cursor-pointer relative overflow-hidden">

                {/* Number block */}
                <div className="flex flex-col items-center justify-center shrink-0 w-16 h-16 rounded-lg bg-gray-900 border border-gray-800 group-hover:bg-gray-800 transition-colors">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Task</span>
                    <span className="text-2xl font-mono text-gray-300 font-bold">
                        {index.toString().padStart(2, '0')}
                    </span>
                </div>

                {/* Content block */}
                <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {title}
                    </h4>
                    <p className="text-sm text-gray-400 line-clamp-2 pr-12">
                        {description.split('## Example')[0].split('## Problem Description')[1]?.trim() || description}
                    </p>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center mt-4 sm:mt-0">
                    <span className="text-xs font-mono text-gray-400 border border-gray-800 rounded-full px-3 py-1 bg-gray-900">
                        {type}
                    </span>
                    <span className={`text-xs font-mono font-medium border rounded-full px-3 py-1 ${diffColor}`}>
                        {difficulty}
                    </span>
                    {/* Status Circle */}
                    <div className="w-5 h-5 rounded-full border-2 border-gray-700 ml-2 group-hover:border-gray-500 transition-colors"></div>
                </div>
            </div>
        </Link>
    );
}
