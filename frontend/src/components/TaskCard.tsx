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
        difficulty.toLowerCase() === "easy" ? "text-green-700 bg-green-50 border-green-200" :
            difficulty.toLowerCase() === "medium" ? "text-orange-700 bg-orange-50 border-orange-200" :
                "text-red-700 bg-red-50 border-red-200";

    return (
        <Link href={`/papers/${paperSlug}/problems/${taskId}`}>
            <div className="border border-gray-100 bg-white rounded-[1.5rem] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:shadow-md transition-all group cursor-pointer relative overflow-hidden shadow-sm">

                {/* Number block */}
                <div className="flex flex-col items-center justify-center shrink-0 w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 group-hover:bg-gray-100 transition-colors">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Task</span>
                    <span className="text-2xl font-bold text-gray-800">
                        {index.toString().padStart(2, '0')}
                    </span>
                </div>

                {/* Content block */}
                <div className="flex-1">
                    <h4 className="text-xl font-bold text-black mb-2 group-hover:text-blue-600 transition-colors">
                        {title}
                    </h4>
                    <p className="text-base text-gray-500 line-clamp-2 pr-12">
                        {description.split('## Example')[0].split('## Problem Description')[1]?.trim() || description}
                    </p>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center mt-4 sm:mt-0">
                    <span className="text-xs font-semibold text-gray-600 border border-gray-200 rounded-full px-3 py-1 bg-gray-50">
                        {type}
                    </span>
                    <span className={`text-xs font-semibold border rounded-full px-3 py-1 ${diffColor}`}>
                        {difficulty}
                    </span>
                    {/* Status Circle */}
                    <div className="w-6 h-6 rounded-full border-2 border-gray-200 ml-2 group-hover:border-blue-500 transition-colors"></div>
                </div>
            </div>
        </Link>
    );
}
