'use client';

import React from 'react';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#111825] border-t border-gray-700/30 overflow-hidden">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-16 left-8 h-28 w-28 rounded-full bg-[#ff6b2b]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-8 h-28 w-28 rounded-full bg-white/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Glass bar with gradient border */}
        <div className="rounded-2xl p-[1.5px] bg-gradient-to-r from-white/10 via-white/5 to-transparent">
          <div className="rounded-[14px] bg-[#111825]/70 backdrop-blur-md px-6 py-5 shadow-[0_10px_28px_rgba(0,0,0,0.28)]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
              {/* Left: Brand */}
              <div className="group inline-flex items-center gap-2">
                <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-[1.06]">
                  <Image src="/emojify-logo.svg" alt="AI Emoji Logo" width={20} height={20} className="opacity-90" />
                </span>
                <span className="text-white font-semibold tracking-tight text-[clamp(1rem,1.2vw,1.1rem)]">
                  AI<span className="text-[#ff6b2b]">Emoji</span>
                </span>
                {/* Accent dot */}
                <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-white/30 ml-1" />
              </div>

              {/* Right: Credit */}
              <div className="text-center sm:text-right">
                <p className="text-gray-300 text-[clamp(0.78rem,0.95vw,0.9rem)] font-medium">
                  crafted with <span className="text-red-500 animate-pulse">❤️</span> by
                  {" "}
                  <a
                    href="https://www.webbuddy.agency/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-transparent hover:decoration-white/40 text-white/90 hover:text-white transition-colors"
                  >
                    webbuddy
                  </a>
                </p>
                {/* Shimmer underline */}
                <div className="mt-1.5 mx-auto sm:ml-auto sm:mr-0 h-px w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
