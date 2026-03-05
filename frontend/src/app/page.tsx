import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-gray-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center text-center">

        <div className="mb-6 inline-block rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm font-medium text-gray-600 shadow-sm">
          🚀 Welcome to the new Papyr Platform
        </div>

        <h1 className="text-6xl sm:text-8xl font-black tracking-tighter mb-8 leading-[1.05] text-black">
          Implement the Future.<br />
          <span className="text-gray-400">Line by Line.</span>
        </h1>

        <p className="max-w-2xl text-xl sm:text-2xl text-gray-600 mb-12 font-medium leading-relaxed">
          Master state-of-the-art machine learning by building breakthrough architectures directly from the original research papers.
        </p>

        <Link href="/papers">
          <button className="bg-black text-white hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg px-10 py-5 rounded-full text-lg font-bold transition-all flex items-center gap-3">
            Explore Papers
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </button>
        </Link>

        {/* Feature Cards following an updated minimal style */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full max-w-6xl">
          <div className="border border-gray-200 bg-white hover:bg-gray-50 transition-colors p-10 rounded-[2.5rem] shadow-sm">
            <div className="text-3xl font-black text-black mb-4">Deconstructed</div>
            <p className="text-gray-600 leading-relaxed text-lg font-medium">Massive models are broken down into logical micro-tasks, guiding you through the implementation journey step-by-step.</p>
          </div>
          <div className="border border-gray-200 bg-white hover:bg-gray-50 transition-colors p-10 rounded-[2.5rem] shadow-sm">
            <div className="text-3xl font-black text-black mb-4">Verified</div>
            <p className="text-gray-600 leading-relaxed text-lg font-medium">Type your code directly into our Monaco workspace. Every solution is instantly evaluated against sandboxed PyTest suites.</p>
          </div>
          <div className="border border-gray-200 bg-white hover:bg-gray-50 transition-colors p-10 rounded-[2.5rem] shadow-sm">
            <div className="text-3xl font-black text-black mb-4">Open-Ended</div>
            <p className="text-gray-600 leading-relaxed text-lg font-medium">Papyr continuously ingests the latest pre-prints directly from ArXiv, leveraging OpenAI to synthesize brand new tasks daily.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
