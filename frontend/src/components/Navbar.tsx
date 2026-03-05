import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="border-b border-gray-800 bg-black sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="flex items-center font-bold text-xl tracking-tight text-white hover:text-gray-300 transition-colors">
                            <span className="text-gray-500 mr-2">{">_"}</span>
                            Papyr
                        </Link>
                        <div className="hidden md:block">
                            <div className="flex items-center space-x-4">
                                <Link href="/papers" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Papers
                                </Link>
                                <Link href="/roadmap" className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Roadmap
                                </Link>
                                <Link href="/about" className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    About
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105">
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
