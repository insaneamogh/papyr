import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="fixed top-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
            <div className="pointer-events-auto bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm rounded-full px-6 py-3 flex items-center justify-between w-full max-w-4xl">
                <div className="flex items-center space-x-8">
                    <Link href="/" className="flex items-center font-extrabold text-xl tracking-tighter text-black hover:opacity-70 transition-opacity">
                        <span className="text-gray-400 mr-2">{">_"}</span>
                        Papyr
                    </Link>
                    <div className="hidden md:block">
                        <div className="flex items-center space-x-6">
                            <Link href="/papers" className="text-gray-500 hover:text-black text-sm font-semibold transition-colors">
                                Papers
                            </Link>
                            <Link href="/roadmap" className="text-gray-500 hover:text-black text-sm font-semibold transition-colors">
                                Roadmap
                            </Link>
                            <Link href="/about" className="text-gray-500 hover:text-black text-sm font-semibold transition-colors">
                                About
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <button className="bg-black text-white hover:bg-gray-800 px-5 py-2 rounded-full text-sm font-bold transition-all shadow-sm">
                        Sign In
                    </button>
                </div>
            </div>
        </nav>
    );
}
