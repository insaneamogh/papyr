import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-gray-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center text-center">

        <h1 className="text-6xl sm:text-8xl font-bold tracking-tighter mb-8 leading-[1.1] text-black">
          Don't just read the paper.<br />
          Compile it.
        </h1>

        <p className="max-w-2xl text-xl sm:text-2xl text-gray-500 mb-12 font-medium leading-relaxed">
          Bridge the gap between machine learning theory and reality. Implement state-of-the-art models from scratch, line by line.
        </p>

        <Link href="/papers">
          <button className="bg-black text-white hover:bg-gray-800 px-10 py-5 rounded-full text-lg font-bold transition-all shadow-sm flex items-center gap-3">
            Start Coding
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </button>
        </Link>

        {/* Feature Cards following Acctual's style */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full max-w-6xl">
          <div className="border border-gray-100 bg-[#F9FAFB] p-10 rounded-[2.5rem] shadow-sm">
            <div className="text-3xl font-bold text-black mb-4">Micro-Tasks</div>
            <p className="text-gray-500 leading-relaxed text-lg">Complex papers are broken down into small, digestible implementation steps. Focus on mastering one concept at a time.</p>
          </div>
          <div className="border border-gray-100 bg-[#F9FAFB] p-10 rounded-[2.5rem] shadow-sm">
            <div className="text-3xl font-bold text-black mb-4">Unit Tests</div>
            <p className="text-gray-500 leading-relaxed text-lg">Your implementation is rigorously verified against hidden test cases in real-time to guarantee mathematical correctness.</p>
          </div>
          <div className="border border-gray-100 bg-[#F9FAFB] p-10 rounded-[2.5rem] shadow-sm">
            <div className="text-3xl font-bold text-black mb-4">Build Models</div>
            <p className="text-gray-500 leading-relaxed text-lg">Put the puzzle pieces together to construct a fully functioning machine learning model directly in your browser.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
