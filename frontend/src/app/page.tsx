import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-gray-800">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center text-center">
        {/* Animated Background Grids... keeping minimal for now */}
        <div className="absolute inset-0 bg-[url('https://papercode.in/grid.svg')] bg-center opacity-10 pointer-events-none"></div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Don't just read the paper.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white">
            Compile it.
          </span>
        </h1>

        <p className="max-w-2xl text-xl text-gray-400 mb-12 font-mono">
          Bridge the gap between theory and reality. Implement state-of-the-art models from scratch, line by line.
        </p>

        <Link href="/papers">
          <button className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 flex items-center gap-2">
            Start Coding
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </button>
        </Link>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full max-w-5xl">
          <div className="border border-gray-800 bg-[#0a0a0a] p-8 rounded-2xl">
            <div className="text-2xl font-bold mb-4">1. Micro-Tasks</div>
            <p className="text-gray-400 leading-relaxed font-mono text-sm">Complex papers are broken down into small, manageable implementation steps. You focus on one concept at a time.</p>
          </div>
          <div className="border border-gray-800 bg-[#0a0a0a] p-8 rounded-2xl">
            <div className="text-2xl font-bold mb-4">2. Unit Tests</div>
            <p className="text-gray-400 leading-relaxed font-mono text-sm">Your code is verified against rigorous unit tests to ensure correctness before moving forward.</p>
          </div>
          <div className="border border-gray-800 bg-[#0a0a0a] p-8 rounded-2xl">
            <div className="text-2xl font-bold mb-4">3. Implement Models</div>
            <p className="text-gray-400 leading-relaxed font-mono text-sm">Put it all together to implement a working model directly in your browser or on our servers.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
