'use client';

import React, { useState, useEffect, KeyboardEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './hero.css'; // We'll create this file next
import { useUser } from '../context/UserContext';
import { generateEmoji } from '../services/emojiService';
import { toast } from 'react-hot-toast';
import AuthModals from './AuthModals';

const Hero: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [inputText, setInputText] = useState('');
  const [emojis, setEmojis] = useState<string[]>([]);
  const { isAuthenticated } = useUser();
  const [emojiPrompt, setEmojiPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [generatedEmojis, setGeneratedEmojis] = useState<Array<{ url: string; isImage: boolean }>>([]);
  const [generatedEmoji, setGeneratedEmoji] = useState<{
    url: string;
    isImage: boolean;
    metadata?: {
      prompt: string;
      dimensions: string;
      model: string;
      date: string;
    };
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      toast.error('Please enter what type of emoji you want to generate');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Generating your emoji...');

    try {
      console.log(`[tf7udl] Generating emoji for prompt: "${inputText.trim()}"`);
      const response = await generateEmoji(inputText.trim());
      
      console.log(`[tf7udl] Emoji generation response:`, {
        success: response.success,
        emoji: response.emoji,
        errorType: response.errorType,
      });
      
      if (response.success && response.emoji) {
        setGeneratedEmoji({
          url: response.emoji.emoji,
          isImage: response.emoji.isImage || false,
          metadata: response.emoji.metadata
        });
        toast.success('Emoji generated successfully!', {
          id: loadingToast,
        });
      } else {
        // Handle error from response
        const errorMessage = response.error || 'Failed to generate emoji';
        console.error(`[tf7udl] Error in emoji generation:`, {
          error: errorMessage,
          type: response.errorType,
          details: response.details
        });
        toast.error(errorMessage, { id: loadingToast });
      }
    } catch (error) {
      // Handle exception
      console.error(`[tf7udl] Exception in emoji generation:`, error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to generate emoji. Please try again.',
        { id: loadingToast }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-black">
        {/* Enhanced background with space theme */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Radial gradient base */}
          <div className="absolute inset-0 bg-gradient-radial from-blue-950/30 via-black to-black"></div>
          
          {/* Dark texture overlay */}
          <div className="absolute inset-0 opacity-30 bg-[url('/noise-texture.png')] mix-blend-overlay"></div>
          
          {/* Grid overlay */}
          <div className="absolute inset-0 z-0 grid-animation pointer-events-none">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.1]"></div>
          </div>
          
          {/* Light streaks */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="light-streak light-streak-1 opacity-30"></div>
            <div className="light-streak light-streak-2 opacity-30"></div>
            <div className="light-streak light-streak-3 opacity-30"></div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
            <div className="particle particle-5"></div>
            <div className="particle particle-6"></div>
          </div>
          
          {/* Animated gradient glow */}
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[50%] bg-gradient-to-br from-blue-900/10 via-blue-700/5 to-transparent rounded-full blur-3xl animate-glow-slow"></div>
          <div className="absolute top-[60%] -right-[20%] w-[60%] h-[40%] bg-gradient-to-br from-indigo-900/10 via-blue-800/5 to-transparent rounded-full blur-3xl animate-glow-slow-reverse"></div>
        </div>

        <div className="relative z-10 pt-24 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Main Title with enhanced animation */}
            <div className="text-center mb-8 opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
              <h1 className="text-center text-6xl md:text-7xl font-bold tracking-tight">
                <span className="text-white">AI</span>
                <span className="text-[#ff6b2b] inline-block hover:scale-110 transition-transform duration-200">E</span>
                <span className="text-[#ff69b4] inline-block hover:scale-110 transition-transform duration-200">moji</span>
                <span className="text-[#ff69b4] inline-block hover:scale-110 transition-transform duration-200">s</span>
                <span className="text-white"> Generator</span>
              </h1>
              <div className="mt-2 text-3xl md:text-4xl font-bold">
                <span className="text-white">made </span>
                <span className="text-gray-500 line-through">for</span>
                <span className="text-white"> by you</span>
              </div>
            </div>

            {/* Character Showcase with enhanced animation */}
            <div className="relative mb-16 opacity-0 animate-[fadeIn_1s_ease-out_0.3s_forwards]">
              <div className="relative group max-w-4xl mx-auto">
                {/* Decorative elements */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                
                {/* Main image container with enhanced glass effect */}
                <div className="relative bg-black/40 rounded-2xl p-1 backdrop-blur-xl border border-blue-500/20">
                  <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent blur-xl"></div>
                  <Image
                    src="/hero.webp"
                    alt="AI Generated Characters"
                    width={1200}
                    height={400}
                    className="w-full h-auto mx-auto rounded-xl transform transition duration-500
                             group-hover:scale-[1.01]"
                    priority
                    quality={100}
                  />
                  
                  {/* Corner accents */}
                  <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-blue-500/20 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-blue-500/20 rounded-bl-lg"></div>
                  
                  {/* Decorative dots */}
                  <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-blue-500/40 animate-pulse"></div>
                  <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-blue-400/40 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-6 left-8 px-4 py-2 bg-black/60 rounded-full shadow-xl backdrop-blur-xl
                              transform -translate-y-2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-0
                              transition-all duration-500 border border-blue-500/20">
                  <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                    ✨ AI Powered
                  </span>
                </div>
                <div className="absolute -bottom-6 right-8 px-4 py-2 bg-black/60 rounded-full shadow-xl backdrop-blur-xl
                              transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0
                              transition-all duration-500 delay-100 border border-blue-500/20">
                  <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                    🎨 Unlimited Styles
                  </span>
                </div>
              </div>
            </div>

            {/* Search Section with enhanced animation */}
            <div className="relative max-w-2xl mx-auto opacity-0 animate-[fadeIn_1s_ease-out_0.6s_forwards]">
              <div className="relative group">
                {/* Search input with enhanced styling */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="I want a cat with hat"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                    className="w-full px-8 py-6 text-lg bg-black/40 rounded-xl
                             text-white placeholder-gray-400
                             focus:outline-none
                             shadow-lg border border-blue-500/20
                             transition-all duration-300 backdrop-blur-xl
                             group-hover:shadow-xl group-hover:border-blue-500/30"
                    disabled={loading}
                  />
                  {/* Animated cursor indicator */}
                  <div className="absolute right-20 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  {/* Submit button with hover effect */}
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 
                             bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400
                             rounded-xl transition-all duration-300
                             flex items-center justify-center group/btn
                             hover:scale-105 hover:shadow-lg shadow-blue-500/20"
                  >
                    {loading ? (
                      <span className="animate-spin">⚡</span>
                    ) : (
                    <svg 
                      className="w-6 h-6 text-white transition-transform duration-300 group-hover/btn:scale-110" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    )}
                  </button>
                </div>

                {/* Search suggestions */}
                <div className="absolute left-0 right-0 top-full mt-4 bg-black/60 rounded-xl 
                              shadow-lg border border-blue-500/20 backdrop-blur-xl
                              opacity-0 translate-y-2 pointer-events-none
                              group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto
                              transition-all duration-300 z-10">
                  <div className="p-2">
                    <div className="text-xs text-gray-400 px-2 py-1 font-medium">Popular searches</div>
                    <button 
                      onClick={() => {
                        setInputText("Wizard cat with magical powers");
                        const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
                        if (inputElement) {
                          inputElement.focus();
                        }
                      }}
                      className="w-full text-left px-4 py-3 text-gray-300 hover:bg-blue-500/10 rounded-lg text-sm transition-colors flex items-center active:bg-blue-500/20"
                    >
                      <span className="mr-2">🧙‍♂️</span> 
                      <span>Wizard cat with magical powers</span>
                      <span className="ml-auto text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs">Click to use</span>
                    </button>
                    <button 
                      onClick={() => {
                        setInputText("Pirate penguin with eye patch");
                        const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
                        if (inputElement) {
                          inputElement.focus();
                        }
                      }}
                      className="w-full text-left px-4 py-3 text-gray-300 hover:bg-blue-500/10 rounded-lg text-sm transition-colors flex items-center active:bg-blue-500/20"
                    >
                      <span className="mr-2">🏴‍☠️</span>
                      <span>Pirate penguin with eye patch</span>
                      <span className="ml-auto text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs">Click to use</span>
                    </button>
                    <button 
                      onClick={() => {
                        setInputText("Gentleman fox with top hat");
                        const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
                        if (inputElement) {
                          inputElement.focus();
                        }
                      }}
                      className="w-full text-left px-4 py-3 text-gray-300 hover:bg-blue-500/10 rounded-lg text-sm transition-colors flex items-center active:bg-blue-500/20"
                    >
                      <span className="mr-2">🎩</span>
                      <span>Gentleman fox with top hat</span>
                      <span className="ml-auto text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs">Click to use</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Suggestions - Updated with trending options and made clickable */}
              <div className="flex items-center justify-center flex-wrap gap-2 mt-8 w-full">
                {[
                  "Space Astronaut Cat",
                  "Cyberpunk Robot",
                  "Magical Unicorn Chef",
                  "Ninja Panda"
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputText(suggestion);
                      // Focus on the input field after setting the text
                      const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
                      if (inputElement) inputElement.focus();
                    }}
                    className="px-4 py-2 bg-black/40 rounded-full text-sm font-medium
                             text-gray-300 border border-blue-500/20 backdrop-blur-xl
                             hover:bg-blue-500/10 hover:scale-105 hover:shadow-md hover:shadow-blue-500/20
                             active:scale-95 transition-all duration-300 ease-out flex items-center gap-1"
                  >
                    <span className="animate-pulse text-xs">✨</span>
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Premium Emoji Display - Glass Morphism Design */}
              {generatedEmoji && (
                <div className="mt-10 flex justify-center">
                  <div className="max-w-sm w-full perspective-1000">
                    {/* Card with glass morphism effect */}
                    <div className="group relative rounded-3xl transition-all duration-700 transform hover:rotate-y-10 hover:scale-105">
                      {/* Glass background with premium gradient border */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-80 blur-sm group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="absolute inset-0.5 rounded-[22px] bg-black/70 backdrop-blur-xl"></div>
                      
                      {/* Card content */}
                      <div className="relative rounded-3xl overflow-hidden backdrop-blur-xl">
                        {/* Emoji Display Area */}
                        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800">
                          {/* Premium corner accents */}
                          <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-blue-500/30 rounded-tl-3xl"></div>
                          <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-purple-500/30 rounded-br-3xl"></div>
                          
                          {/* Emoji Image with enhanced effects */}
                          {generatedEmoji.isImage ? (
                            <div className="absolute inset-0 flex items-center justify-center p-6 transition-all duration-700 group-hover:scale-105">
                              <div className="relative">
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <img 
                                  src={generatedEmoji.url} 
                                  alt={`Generated Emoji for ${generatedEmoji.metadata?.prompt || 'prompt'}`}
                                  className="w-full h-full object-contain relative drop-shadow-2xl transform transition-all duration-700"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <span className="text-9xl drop-shadow-2xl">{generatedEmoji.url}</span>
                            </div>
                          )}
                          
                          {/* Floating badges */}
                          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                            <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-xs font-medium text-blue-300 border border-blue-500/20 shadow-lg shadow-blue-900/20 flex items-center gap-2">
                              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                              {generatedEmoji.metadata?.model || 'AI Emoji'}
                            </div>
                            <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-xs font-medium text-purple-300 border border-purple-500/20 shadow-lg shadow-purple-900/20">
                              {generatedEmoji.metadata?.dimensions || '768×768'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Info Section with improved styling */}
                        <div className="p-6 space-y-4 backdrop-blur-lg backdrop-saturate-150 bg-gradient-to-b from-gray-900/80 to-black/80">
                          {/* Title with animated gradient */}
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 truncate">
                              {inputText}
                            </h3>
                            <p className="text-gray-400 text-sm flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              {generatedEmoji.metadata?.date}
                            </p>
                          </div>
                          
                          {/* Enhanced Action Buttons */}
                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(generatedEmoji.url);
                                toast.success('Copied to clipboard', {
                                  style: {
                                    border: '1px solid #4B5563',
                                    padding: '16px',
                                    color: '#F3F4F6',
                                    background: '#1F2937'
                                  },
                                  iconTheme: {
                                    primary: '#6366F1',
                                    secondary: '#1F2937',
                                  },
                                });
                              }}
                              className="flex-1 px-4 py-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl text-sm font-medium
                                        text-gray-200 hover:from-gray-700 hover:to-gray-800 active:scale-95 shadow-md shadow-black/30
                                        transition-all duration-200 flex items-center justify-center gap-2 border border-gray-700"
                              aria-label="Copy URL"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy
                            </button>
                            
                            <a
                              href={generatedEmoji.url}
                              download={`emoji-${inputText.replace(/\s+/g, '-')}.png`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-4 py-3 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl text-sm font-medium
                                        text-white hover:from-indigo-500 hover:to-blue-600 active:scale-95 shadow-md shadow-indigo-900/30
                                        transition-all duration-200 flex items-center justify-center gap-2 border border-indigo-500/20"
                              aria-label="Download emoji"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download
                            </a>
                    </div>
                          
                          {/* Additional Actions Row */}
                          <div className="pt-4 flex justify-between items-center border-t border-gray-800">
                            <button
                              onClick={handleSubmit}
                              className="group text-sm text-gray-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2"
                              disabled={loading}
                            >
                              <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Regenerate
                            </button>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  if (navigator.share) {
                                    navigator.share({
                                      title: `AI Emoji: ${inputText}`,
                                      text: `Check out this AI-generated emoji for "${inputText}"`,
                                      url: generatedEmoji.url
                                    }).catch(err => console.error('Error sharing:', err));
                                  } else {
                                    navigator.clipboard.writeText(generatedEmoji.url);
                                    toast.success('URL copied - share it with others!');
                                  }
                                }}
                                className="p-2 text-gray-400 hover:text-blue-300 transition-colors duration-200 rounded-full hover:bg-gray-800"
                                aria-label="Share"
                              >
                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Credit embedded in card bottom instead of separate element */}
                    <div className="text-center py-2">
                      <p className="text-xs text-gray-600 inline-block px-2 py-0.5 bg-gray-900/70 backdrop-blur-sm rounded-md">
                        <span className="text-blue-400">AI Emoji</span> Generator
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original Hero component for non-authenticated users
  return (
    <div className="relative">
      <section className="w-full flex flex-col items-center justify-start pt-28 pb-16 px-4 relative overflow-hidden bg-black">
        {/* Enhanced background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Radial gradient base */}
          <div className="absolute inset-0 bg-gradient-radial from-blue-950/30 via-black to-black"></div>
          
          {/* Dark texture overlay */}
          <div className="absolute inset-0 opacity-30 bg-[url('/noise-texture.png')] mix-blend-overlay"></div>
          
          {/* Animated gradient glow */}
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[50%] bg-gradient-to-br from-blue-900/10 via-blue-700/5 to-transparent rounded-full blur-3xl animate-glow-slow"></div>
          <div className="absolute top-[60%] -right-[20%] w-[60%] h-[40%] bg-gradient-to-br from-indigo-900/10 via-blue-800/5 to-transparent rounded-full blur-3xl animate-glow-slow-reverse"></div>
        </div>
        
        {/* Grid overlay - adjusted opacity to 0.1 */}
        <div className="absolute inset-0 z-0 grid-animation pointer-events-none">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.1]"></div>
        </div>
        
        {/* Light streaks */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="light-streak light-streak-1 opacity-30"></div>
          <div className="light-streak light-streak-2 opacity-30"></div>
          <div className="light-streak light-streak-3 opacity-30"></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
          <div className="particle particle-6"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            {/* Left side - Text content */}
            <div className={`max-w-xl w-full transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* "Free" Badge */}
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-xs font-medium">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                  100% FREE TO USE
                </span>
              </div>
            
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                <span className="text-white">Free Online </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">AI Emoji Generator</span>
              </h1>
              
              <p className="text-lg text-gray-300 mb-8">
                Transform your ideas into stunning emojis instantly. Define your style, get your emoji in seconds. No design skills required.
              </p>
              
              {/* Feature bullets */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                  </div>
                  <p className="ml-3 text-gray-300">Create custom emojis in seconds with AI</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                  </div>
                  <p className="ml-3 text-gray-300">Multiple styles and customization options</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                  </div>
                  <p className="ml-3 text-gray-300">Download high-quality PNG files instantly</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 
                            text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20 text-lg
                            hover:shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-0.5"
                >
                  Create Emojis with AI
                </button>
                <button
                  onClick={() => {
                    const emojiShowcaseSection = document.getElementById('emoji-showcase');
                    if (emojiShowcaseSection) {
                      emojiShowcaseSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="inline-flex items-center justify-center px-6 py-3 bg-transparent hover:bg-white/5
                            text-white font-medium rounded-lg transition-all duration-200 border border-gray-700
                            hover:border-gray-500 text-lg"
                >
                  View Examples
                </button>
              </div>
              
              {/* Usage stat */}
              <div className="mt-8 text-gray-400 text-sm flex items-center">
                <div className="flex -space-x-2 mr-3">
                  <div className="h-6 w-6 rounded-full bg-blue-500"></div>
                  <div className="h-6 w-6 rounded-full bg-cyan-500"></div>
                  <div className="h-6 w-6 rounded-full bg-sky-500"></div>
                </div>
                <span>Join 10,000+ users creating custom emojis</span>
              </div>
            </div>
            
            {/* Right side - Hero Image */}
            <div className={`relative transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              {/* Emoji Display Floating Box */}
              <div className="relative w-[340px] h-[340px] md:w-[500px] md:h-[500px] border border-blue-500/10 rounded-lg p-6 bg-black/40 backdrop-blur-md">
                {/* Glow effects */}
                <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent blur-xl"></div>
                
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-blue-500/20 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-blue-500/20 rounded-bl-lg"></div>
                
                {/* Grid overlay on box - almost invisible */}
                <div className="absolute inset-0 opacity-[0.01] bg-[url('/grid-pattern.svg')] rounded-lg overflow-hidden"></div>
                
                {/* Hero Image Container with animation */}
                <div className="relative w-full h-full flex items-center justify-center hero-image-container">
                  <div className="absolute inset-4 bg-blue-500/5 rounded-lg"></div>
                  
                  {/* Main Emoji Image */}
                  <Image 
                    src="/heroimage.png"
                    alt="AI generated emoji collection" 
                    width={470}
                    height={470}
                    className="object-contain z-10 drop-shadow-2xl transform-gpu"
                    priority
                  />
                </div>
                
                {/* Decorative floating dots */}
                <div className="absolute top-10 left-4 w-2 h-2 rounded-full bg-blue-500/40 animate-pulse"></div>
                <div className="absolute top-5 right-10 w-3 h-3 rounded-full bg-cyan-500/40 animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-10 right-6 w-2 h-2 rounded-full bg-blue-400/40 animate-pulse" style={{animationDelay: '0.5s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Emoji Showcase Section - NEW */}
      <section id="emoji-showcase" className="w-full pt-20 pb-24 px-4 bg-black -mt-8 relative z-10">
        {/* Enhanced background - same as hero */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Radial gradient base */}
          <div className="absolute inset-0 bg-gradient-radial from-blue-950/30 via-black to-black"></div>
          
          {/* Dark texture overlay */}
          <div className="absolute inset-0 opacity-30 bg-[url('/noise-texture.png')] mix-blend-overlay"></div>
          
          {/* Animated gradient glow */}
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[50%] bg-gradient-to-br from-blue-900/10 via-blue-700/5 to-transparent rounded-full blur-3xl animate-glow-slow"></div>
          <div className="absolute top-[60%] -right-[20%] w-[60%] h-[40%] bg-gradient-to-br from-indigo-900/10 via-blue-800/5 to-transparent rounded-full blur-3xl animate-glow-slow-reverse"></div>
        </div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 z-0 grid-animation pointer-events-none">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.1]"></div>
        </div>
        
        {/* Light streaks */}
        <div className="absolute inset-0">
          <div className="light-streak light-streak-1 opacity-30"></div>
          <div className="light-streak light-streak-2 opacity-30"></div>
          <div className="light-streak light-streak-3 opacity-30"></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 z-0">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
          <div className="particle particle-6"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Create Any Emoji You Can Imagine with AI
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Need unique emojis for your brand? Want to express something specific? Our AI understands your vision and brings it to life. From playful animals to branded icons, create emojis that tell your story:
            </p>
          </div>
          
          <div className="relative">
            {/* Subtle glow background for the image */}
            <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-transparent to-transparent rounded-xl blur-xl"></div>
            
            {/* Emoji showcase image */}
            <div className="relative border border-gray-800 rounded-xl overflow-hidden shadow-2xl bg-black/40 backdrop-blur-md p-6">
              <Image
                src="/emojis.png"
                alt="Collection of AI generated emojis including wizard hat, rocket, dog, portrait, cat, shark, boy eating and pancakes"
                width={1200}
                height={600}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 border-t-2 border-l-2 border-blue-500/20 rounded-tl-lg"></div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-2 border-r-2 border-blue-500/20 rounded-br-lg"></div>
          </div>
        </div>
      </section>

      {/* How to Generate Section */}
      <section className="w-full py-24 px-4 bg-black relative z-10">
        {/* Enhanced background - same as hero */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Radial gradient base */}
          <div className="absolute inset-0 bg-gradient-radial from-blue-950/30 via-black to-black"></div>
          
          {/* Dark texture overlay */}
          <div className="absolute inset-0 opacity-30 bg-[url('/noise-texture.png')] mix-blend-overlay"></div>
          
          {/* Animated gradient glow */}
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[50%] bg-gradient-to-br from-blue-900/10 via-blue-700/5 to-transparent rounded-full blur-3xl animate-glow-slow"></div>
          <div className="absolute top-[60%] -right-[20%] w-[60%] h-[40%] bg-gradient-to-br from-indigo-900/10 via-blue-800/5 to-transparent rounded-full blur-3xl animate-glow-slow-reverse"></div>
        </div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 z-0 grid-animation pointer-events-none">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.1]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              How to Generate Your Custom Emojis
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Create with our AI emoji generator in three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className={`flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-400/20 rounded-xl blur-xl"></div>
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600/10 to-blue-400/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20 backdrop-blur-sm relative group overflow-hidden hover:border-blue-500/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-black/50 rounded-xl group-hover:bg-black/40 transition-all duration-300"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-br from-blue-600/20 via-transparent to-transparent transition-opacity duration-300"></div>
                  <span className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold text-base shadow-lg shadow-blue-500/30">1</span>
                  <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-400 relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" className="drop-shadow-md" />
                  </svg>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500/5 to-blue-400/5 rounded-xl p-6 border border-blue-500/10 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300 mb-4">Write Your Prompt</h3>
                <p className="text-gray-300">
                  Describe your emoji idea freely, or try our template for inspiration: '[Object] in cartoon style, design matching emoji style. PNG format with transparent background'
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-xl blur-xl"></div>
                <div className="w-20 h-20 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-xl flex items-center justify-center mb-6 border border-blue-400/20 backdrop-blur-sm relative group overflow-hidden hover:border-cyan-400/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-black/50 rounded-xl group-hover:bg-black/40 transition-all duration-300"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-br from-cyan-500/20 via-transparent to-transparent transition-opacity duration-300"></div>
                  <span className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold text-base shadow-lg shadow-cyan-500/30">2</span>
                  <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400 relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M13 10V3L4 14h7v7l9-11h-7z" className="drop-shadow-md" />
                    <circle cx="13" cy="6" r="1" fill="currentColor" className="animate-ping opacity-70" style={{ animationDuration: '2.5s' }}/>
                  </svg>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-400/5 to-cyan-400/5 rounded-xl p-6 border border-blue-400/10 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">Generate</h3>
                <p className="text-gray-300">
                  Click the generate button and wait for 3-15 seconds while our AI brings your emoji to life. You'll see the result right on screen.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-xl blur-xl"></div>
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-xl flex items-center justify-center mb-6 border border-cyan-400/20 backdrop-blur-sm relative group overflow-hidden hover:border-blue-500/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-black/50 rounded-xl group-hover:bg-black/40 transition-all duration-300"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-br from-blue-500/20 via-transparent to-transparent transition-opacity duration-300"></div>
                  <span className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold text-base shadow-lg shadow-blue-500/30">3</span>
                  <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500 relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" className="drop-shadow-md" />
                    <circle cx="18" cy="8" r="1" fill="currentColor" className="animate-pulse opacity-70" style={{ animationDuration: '2s' }}/>
                  </svg>
                </div>
              </div>
              <div className="bg-gradient-to-r from-cyan-400/5 to-blue-500/5 rounded-xl p-6 border border-cyan-400/10 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">Download & Edit</h3>
                <p className="text-gray-300">
                  Download your emoji as a PNG file, then use our one-click background removal tool if you need a transparent background. Ready to use anywhere.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 hover:from-blue-600 hover:via-blue-500 hover:to-cyan-500
              text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20
              hover:shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-0.5 text-lg relative group overflow-hidden cursor-pointer"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 opacity-0 group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></span>
              <span className="relative">Create Emojis with AI</span>
              <svg className="w-5 h-5 ml-2 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Why Use an Emoji Generator Section */}
      <section className="w-full py-24 px-4 bg-black relative z-10">
        {/* Enhanced background - same as hero */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-radial from-blue-950/30 via-black to-black"></div>
          <div className="absolute inset-0 opacity-30 bg-[url('/noise-texture.png')] mix-blend-overlay"></div>
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[50%] bg-gradient-to-br from-blue-900/10 via-blue-700/5 to-transparent rounded-full blur-3xl animate-glow-slow"></div>
          <div className="absolute top-[60%] -right-[20%] w-[60%] h-[40%] bg-gradient-to-br from-indigo-900/10 via-blue-800/5 to-transparent rounded-full blur-3xl animate-glow-slow-reverse"></div>
        </div>
        
        <div className="absolute inset-0 z-0 grid-animation pointer-events-none">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.1]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Why Use an Emoji Generator?
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-12">
              Stand out in the digital world with custom emojis that perfectly match your brand or expression needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-r from-blue-500/5 to-blue-400/5 rounded-xl p-8 border border-blue-500/10 backdrop-blur-sm transform transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-white/10 transition-opacity duration-300"></div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white relative z-10 group-hover:scale-110 transition-transform duration-300">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" className="drop-shadow-md" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Unique Branding</h3>
              <p className="text-gray-300">Create emojis that perfectly match your brand identity and stand out from generic options.</p>
            </div>

            <div className="bg-gradient-to-r from-blue-400/5 to-cyan-400/5 rounded-xl p-8 border border-blue-400/10 backdrop-blur-sm transform transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-white/10 transition-opacity duration-300"></div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white relative z-10 group-hover:scale-110 transition-transform duration-300">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M13 10V3L4 14h7v7l9-11h-7z" className="drop-shadow-md" />
                  <circle cx="13" cy="6" r="1" fill="currentColor" className="animate-ping opacity-70" style={{ animationDuration: '2.5s' }}/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Instant Creation</h3>
              <p className="text-gray-300">Generate professional-quality emojis in seconds without any design skills or expensive software.</p>
            </div>

            <div className="bg-gradient-to-r from-cyan-400/5 to-blue-500/5 rounded-xl p-8 border border-cyan-400/10 backdrop-blur-sm transform transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-white/10 transition-opacity duration-300"></div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white relative z-10 group-hover:scale-110 transition-transform duration-300">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" className="drop-shadow-md" />
                  <circle cx="18" cy="8" r="1" fill="currentColor" className="animate-pulse opacity-70" style={{ animationDuration: '2s' }}/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Endless Possibilities</h3>
              <p className="text-gray-300">Express any concept or emotion with custom emojis that perfectly capture your ideas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Write a Good Emoji AI Prompt Section */}
      <section className="w-full py-24 px-4 bg-black relative z-10">
        {/* Enhanced background - same as hero */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-radial from-blue-950/30 via-black to-black"></div>
          <div className="absolute inset-0 opacity-30 bg-[url('/noise-texture.png')] mix-blend-overlay"></div>
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[50%] bg-gradient-to-br from-blue-900/10 via-blue-700/5 to-transparent rounded-full blur-3xl animate-glow-slow"></div>
          <div className="absolute top-[60%] -right-[20%] w-[60%] h-[40%] bg-gradient-to-br from-indigo-900/10 via-blue-800/5 to-transparent rounded-full blur-3xl animate-glow-slow-reverse"></div>
        </div>
        
        <div className="absolute inset-0 z-0 grid-animation pointer-events-none">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.1]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              How to Write a Good Emoji AI Prompt?
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-12">
              Master the art of crafting perfect prompts to get exactly the emoji you want.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-blue-500/5 to-cyan-400/5 rounded-xl p-8 border border-blue-500/10 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-6">Prompt Template</h3>
              <div className="bg-black/40 rounded-lg p-6 border border-blue-500/20">
                <code className="text-blue-400 block whitespace-pre-wrap">
                  [Object/Character] in [Style] style, [Additional Details], emoji design with transparent background
                </code>
              </div>
              <div className="mt-6 space-y-4">
                <p className="text-gray-300">
                  <span className="text-blue-400 font-semibold">Example 1:</span> "Happy golden retriever in cartoon style, playful expression, emoji design with transparent background"
                </p>
                <p className="text-gray-300">
                  <span className="text-blue-400 font-semibold">Example 2:</span> "Pizza slice in kawaii style, cute face, steam rising, emoji design with transparent background"
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-400/5 to-cyan-400/5 rounded-xl p-6 border border-blue-400/10 backdrop-blur-sm">
                <h4 className="text-xl font-bold text-white mb-3">Be Specific</h4>
                <p className="text-gray-300">Include clear details about the subject, style, expression, and any unique features you want in your emoji.</p>
              </div>

              <div className="bg-gradient-to-r from-cyan-400/5 to-blue-500/5 rounded-xl p-6 border border-cyan-400/10 backdrop-blur-sm">
                <h4 className="text-xl font-bold text-white mb-3">Choose Your Style</h4>
                <p className="text-gray-300">Specify the art style: cartoon, kawaii, minimal, realistic, or any other style that matches your needs.</p>
              </div>

              <div className="bg-gradient-to-r from-blue-500/5 to-cyan-400/5 rounded-xl p-6 border border-blue-500/10 backdrop-blur-sm">
                <h4 className="text-xl font-bold text-white mb-3">Add Context</h4>
                <p className="text-gray-300">Include emotional context or specific actions to make your emoji more expressive and meaningful.</p>
              </div>

              <div className="bg-gradient-to-r from-cyan-400/5 to-blue-400/5 rounded-xl p-6 border border-cyan-400/10 backdrop-blur-sm">
                <h4 className="text-xl font-bold text-white mb-3">Technical Details</h4>
                <p className="text-gray-300">Always mention "emoji design with transparent background" to ensure your emoji is ready to use anywhere.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-4 bg-black/80 backdrop-blur-lg relative z-10 border-t border-blue-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
            <div className="flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg group-hover:bg-blue-500/30 transition-all duration-300"></div>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Main emoji circle with gradient */}
                  <circle cx="16" cy="16" r="14" fill="url(#emojiGradient)" />
                  
                  {/* Smile curve */}
                  <path d="M10 18C10 18 12 22 16 22C20 22 22 18 22 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Eyes */}
                  <circle cx="11" cy="13" r="2" fill="white" />
                  <circle cx="21" cy="13" r="2" fill="white" />
                  
                  {/* AI circuit patterns */}
                  <path d="M4 16C4 16 8 10 16 10C24 10 28 16 28 16" stroke="#4299E1" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2 2" />
                  <path d="M5 10L8 7" stroke="#4299E1" strokeWidth="1" strokeOpacity="0.7" />
                  <path d="M27 10L24 7" stroke="#4299E1" strokeWidth="1" strokeOpacity="0.7" />
                  
                  {/* Small sparkle elements */}
                  <circle cx="27" cy="16" r="1" fill="#FFD700" />
                  <circle cx="5" cy="16" r="1" fill="#FFD700" />
                  
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="emojiGradient" x1="2" y1="2" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#3182CE" />
                      <stop offset="100%" stopColor="#1A365D" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Animated sparkle effect on hover */}
                <div className="absolute -top-1 -right-1 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 0L7 4L10 5L7 6L6 10L5 6L2 5L5 4L6 0Z" fill="#FFD700" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                  Emojify
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center px-4 py-2 rounded-full bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-all duration-300">
                <span className="text-gray-400">crafted by</span>
                <a 
                  href="https://webbuddy.agency" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-400 hover:text-blue-300 transition-colors ml-2 font-medium"
                >
                  webbuddy.agency
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <AuthModals 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

// Add CSS classes for 3D effects
const styleTag = typeof document !== 'undefined' ? document.createElement('style') : null;
if (styleTag) {
  styleTag.innerHTML = `
    .perspective-1000 {
      perspective: 1000px;
    }
    .rotate-y-10 {
      transform: rotateY(10deg);
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    .animate-float {
      animation: float 3s ease-in-out infinite;
    }
  `;
  document.head.appendChild(styleTag);
}

export default Hero; 