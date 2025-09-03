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

    // Check if user is authenticated before generating
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      toast('Please login to generate emojis');
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

  // Always show emoji generator interface for all users
    return (
      <div className="relative min-h-[70vh] bg-[#0A0A0A]">
        {/* Enhanced background with space theme */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Radial gradient base */}
          <div className="absolute inset-0 bg-gradient-radial from-gray-950/30 via-black to-black"></div>
          
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
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[50%] bg-gradient-to-br from-gray-900/10 via-gray-700/5 to-transparent rounded-full blur-3xl animate-glow-slow"></div>
          <div className="absolute top-[60%] -right-[20%] w-[60%] h-[40%] bg-gradient-to-br from-gray-900/10 via-gray-800/5 to-transparent rounded-full blur-3xl animate-glow-slow-reverse"></div>
        </div>

        <div className="relative z-10 pt-12 pb-8 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Main Title with enhanced animation */}
            <div className="text-center mb-4 opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
              <h1 className="text-center text-4xl md:text-5xl font-bold tracking-tight">
                <span className="text-white">AI</span>
                <span className="text-[#ff6b2b] inline-block hover:scale-110 transition-transform duration-200">E</span>
                <span className="text-[#ff69b4] inline-block hover:scale-110 transition-transform duration-200">moji</span>
                <span className="text-[#ff69b4] inline-block hover:scale-110 transition-transform duration-200">s</span>
                <span className="text-white"> Generator</span>
              </h1>
              <div className="mt-1 text-2xl md:text-3xl font-bold">
                <span className="text-white">made </span>
                <span className="text-gray-500 line-through">for</span>
                <span className="text-white"> by you</span>
              </div>
            </div>

            {/* Character Showcase with enhanced animation */}
            <div className="relative mb-8 opacity-0 animate-[fadeIn_1s_ease-out_0.3s_forwards]">
              <div className="relative group max-w-3xl mx-auto">
                {/* Decorative elements */}
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                
                {/* Main image container with enhanced glass effect */}
                <div className="relative bg-black/40 rounded-2xl p-1 backdrop-blur-xl border border-gray-500/20">
                  <div className="absolute inset-0 bg-gradient-radial from-gray-500/10 via-transparent to-transparent blur-xl"></div>
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
                  <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-gray-500/20 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-gray-500/20 rounded-bl-lg"></div>
                  
                  {/* Decorative dots */}
                  <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-gray-500/40 animate-pulse"></div>
                  <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-gray-400/40 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-6 left-8 px-4 py-2 bg-black/60 rounded-full shadow-xl backdrop-blur-xl
                              transform -translate-y-2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-0
                              transition-all duration-500 border border-gray-500/20">
                  <span className="text-sm font-medium bg-gradient-to-r from-gray-400 to-gray-300 bg-clip-text text-transparent">
                    ✨ AI Powered
                  </span>
                </div>
                <div className="absolute -bottom-6 right-8 px-4 py-2 bg-black/60 rounded-full shadow-xl backdrop-blur-xl
                              transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0
                              transition-all duration-500 delay-100 border border-gray-500/20">
                  <span className="text-sm font-medium bg-gradient-to-r from-gray-400 to-gray-300 bg-clip-text text-transparent">
                    🎨 Unlimited Styles
                  </span>
                </div>
              </div>
            </div>

            {/* Search Section with enhanced animation */}
            <div className="relative max-w-2xl mx-auto opacity-0 animate-[fadeIn_1s_ease-out_0.6s_forwards] mt-4">
              <div className="relative group">
                {/* Search input with enhanced styling */}
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="I want a cat with hat"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                    className="w-full px-6 py-4 text-base bg-black/40 rounded-xl
                             text-white placeholder-gray-400
                             focus:outline-none
                             shadow-lg border border-gray-500/20
                             transition-all duration-300 backdrop-blur-xl
                             group-hover:shadow-xl group-hover:border-gray-500/30"
                    disabled={loading}
                  />
                  {/* Animated cursor indicator */}
                  <div className="absolute right-16 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                  {/* Submit button with hover effect */}
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10
                             bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400
                             rounded-lg transition-all duration-300
                             flex items-center justify-center group/btn
                             hover:scale-105 hover:shadow-lg shadow-gray-500/20"
                  >
                    {loading ? (
                      <span className="animate-spin">⚡</span>
                    ) : (
                    <svg 
                      className="w-4 h-4 text-white transition-transform duration-300 group-hover/btn:scale-110"
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
                              shadow-lg border border-gray-500/20 backdrop-blur-xl
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
                      className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-500/10 rounded-lg text-sm transition-colors flex items-center active:bg-gray-500/20"
                    >
                      <span className="mr-2">🧙‍♂️</span> 
                      <span>Wizard cat with magical powers</span>
                      <span className="ml-auto text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs">Click to use</span>
                    </button>
                    <button 
                      onClick={() => {
                        setInputText("Pirate penguin with eye patch");
                        const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
                        if (inputElement) {
                          inputElement.focus();
                        }
                      }}
                      className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-500/10 rounded-lg text-sm transition-colors flex items-center active:bg-gray-500/20"
                    >
                      <span className="mr-2">🏴‍☠️</span>
                      <span>Pirate penguin with eye patch</span>
                      <span className="ml-auto text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs">Click to use</span>
                    </button>
                    <button 
                      onClick={() => {
                        setInputText("Gentleman fox with top hat");
                        const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
                        if (inputElement) {
                          inputElement.focus();
                        }
                      }}
                      className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-500/10 rounded-lg text-sm transition-colors flex items-center active:bg-gray-500/20"
                    >
                      <span className="mr-2">🎩</span>
                      <span>Gentleman fox with top hat</span>
                      <span className="ml-auto text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs">Click to use</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Suggestions - Updated with trending options and made clickable */}
              <div className="flex items-center justify-center flex-wrap gap-2 mt-4 w-full">
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
                             text-gray-300 border border-gray-500/20 backdrop-blur-xl
                             hover:bg-gray-500/10 hover:scale-105 hover:shadow-md hover:shadow-gray-500/20
                             active:scale-95 transition-all duration-300 ease-out flex items-center gap-1"
                  >
                    <span className="animate-pulse text-xs">✨</span>
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Premium Emoji Display - Glass Morphism Design */}
              {generatedEmoji && (
                <div className="mt-6 flex justify-center">
                  <div className="max-w-xs w-full perspective-1000">
                    {/* Card with glass morphism effect */}
                    <div className="group relative rounded-3xl transition-all duration-700 transform hover:rotate-y-10 hover:scale-105">
                      {/* Glass background with premium gradient border */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-500/20 via-gray-400/20 to-gray-600/20 opacity-80 blur-sm group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="absolute inset-0.5 rounded-[22px] bg-black/70 backdrop-blur-xl"></div>
                      
                      {/* Card content */}
                      <div className="relative rounded-3xl overflow-hidden backdrop-blur-xl">
                        {/* Emoji Display Area */}
                        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800">
                          {/* Premium corner accents */}
                          <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-gray-500/30 rounded-tl-3xl"></div>
                          <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-purple-500/30 rounded-br-3xl"></div>
                          
                          {/* Emoji Image with enhanced effects */}
                          {generatedEmoji.isImage ? (
                            <div className="absolute inset-0 flex items-center justify-center p-6 transition-all duration-700 group-hover:scale-105">
                              <div className="relative">
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 via-gray-400/10 to-gray-600/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
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
                            <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-xs font-medium text-gray-300 border border-gray-500/20 shadow-lg shadow-gray-900/20 flex items-center gap-2">
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
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
                            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 truncate">
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
                              className="flex-1 px-4 py-3 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl text-sm font-medium
                                        text-white hover:from-gray-500 hover:to-gray-600 active:scale-95 shadow-md shadow-indigo-900/30
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
                              className="group text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200 flex items-center gap-2"
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
                                className="p-2 text-gray-400 hover:text-gray-300 transition-colors duration-200 rounded-full hover:bg-gray-800"
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
                        <span className="text-gray-400">AI Emoji</span> Generator
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModals
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode="login"
        />

        {/* Discover Emojis Section */}
        <section className="py-16 bg-gradient-to-b from-[#0A0A0A] to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Discover Emojis
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore our collection of stunning 3D emojis for every occasion
            </p>
        </div>
        
          {/* Emoji Grid - 7x7 Image Layout */}
          <div className="grid grid-cols-7 gap-4 md:gap-6">
            {/* Row 1 */}
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com red-spider-web-.png" 
                  alt="Red Spider Web" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com iron-man-.png" 
                  alt="Iron Man" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com raincoat-with-hood.png" 
                  alt="Raincoat with Hood" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com elektro-auto-ladestation.png" 
                  alt="Elektro Auto Ladestation" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com auto.png" 
                  alt="Auto" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/planet-with-rings.png" 
                  alt="Planet with Rings" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/web-slinger-hero-fake.png" 
                  alt="Web Slinger Hero" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com make-it-more-realistic,-no-any-fruit-just-water.png" 
                  alt="Water Droplet" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com no-stopping-any-time-sign.png" 
                  alt="No Stopping Sign" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com no-smoking-sign.png" 
                  alt="No Smoking Sign" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com ghost-holding-a-'no-entry'-sign.png" 
                  alt="Ghost with No Entry Sign" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com rococo-entry-ticket.png" 
                  alt="Rococo Entry Ticket" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com rococo-flower.png" 
                  alt="Rococo Flower" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img
                  src="/emojis.com over-the-hear-headphones-with-a-mic.png"
                  alt="Over the Hear Headphones with Mic"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com dog-with-horns-and-vampire-wings.png" 
                  alt="Dog with Horns and Vampire Wings" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com cufflinks.png" 
                  alt="Cufflinks" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com appetizing-lunchbox.png" 
                  alt="Appetizing Lunchbox" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com rain-season.png" 
                  alt="Rain Season" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com captain-america.png" 
                  alt="Captain America" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com top-hat.png" 
                  alt="Top Hat" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com burger-with-top-hat (2).png" 
                  alt="Burger with Top Hat" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>

            {/* Row 4 */}
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com horse-with-horns-and-red-bat-wings.png" 
                  alt="Horse with Horns and Red Bat Wings" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com virat-kohli-with-cricket-bat.png" 
                  alt="Virat Kohli with Cricket Bat" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com acorn.png" 
                  alt="Acorn" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com shark-with-a-top-hat.png" 
                  alt="Shark with a Top Hat" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com the-emir-of-qatar-in-his-traditional-dress-in-office__.png" 
                  alt="The Emir of Qatar in Traditional Dress" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com a-worker-in-factorya-3d-rendered-head-of-a-character-inspired-by-super-mario,-facing-slightly-from-front-left-to-right.-the-head-should-include-his-signature-red-cap-with-an-'m',-large-round-nose,-thick-mustach.png" 
                  alt="Super Mario Inspired Character" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com a-secure-bank-vault-in-skeuomorphism-style,-metallic-textures,-realistic-details,-shiny-lock,-heavy-door,-3d-effect.png" 
                  alt="Secure Bank Vault" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>

            {/* Row 5 */}
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com bright-and-expressive-male-visionary,-fair-skin,-tousled-golden-hair,-wide-joyful-eyes,-wearing-a-green-hoodie-over-a-yellow-tee,-one-hand-raised-with-a-glowing-lightbulb,-waist-up,-front-facing.png" 
                  alt="Bright and Expressive Male Visionary" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com a-realistic-marble-patterned-like-the-earth,-with-a-red-circle-of-constellations-and-stars-around-it,-skeuomorphism-style.png" 
                  alt="Realistic Marble Earth with Red Circle of Constellations" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com isometric-illustration-of-paris,-featuring-the-photorealistic-eiffel-tower-surrounded-by-small-parisian-buildings-and-trees,-highly-detailed-in-semi-realistic-style.png" 
                  alt="Isometric Illustration of Paris with Eiffel Tower" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/bowl-of-food.png" 
                  alt="Bowl of Food" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img
                  src="/emojis.com caped-hero-fake.png"
                  alt="Caped Hero"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img
                  src="/emojis.com pistachio.png"
                  alt="Pistachio"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img
                  src="/cat-with-sunglasses.png"
                  alt="Cat with Sunglasses"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>

            {/* Row 6 */}
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com speedster-hero.png" 
                  alt="Speedster Hero" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com wolf-hero.png" 
                  alt="Wolf Hero" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com crashed-car-with-smoke.png" 
                  alt="Crashed Car with Smoke" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com smoke.png" 
                  alt="Smoke" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com ai-bot-cute-machine.png" 
                  alt="AI Bot Cute Machine" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com ai.png" 
                  alt="AI" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com un-café-con-nata-en-taza-rosa-y-con-sprinkles-.png" 
                  alt="Café con Nata en Taza Rosa y con Sprinkles" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>

            {/* Row 7 */}
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com shiba-inu-eating-banana.png" 
                  alt="Shiba Inu Eating Banana" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com panda-eating-bamboo-in-forrest,-close-up-pose.png" 
                  alt="Panda Eating Bamboo in Forrest" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com girl-talking-on-phone,-close-up-pose.png" 
                  alt="Girl Talking on Phone" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com prince-and-princess-disney-dress-close-up-photo-in-castle-background.png" 
                  alt="Prince and Princess Disney Dress" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img 
                  src="/emojis.com thumbs-up.png" 
                  alt="Thumbs Up" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img
                  src="/emojis.com curled-up-hedgehog-lying-on-his-back,-3d-emoji-style.png"
                  alt="Curled Up Hedgehog"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="emoji-item group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-full aspect-square bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img
                  src="/gehirm.png"
                  alt="Brain"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="mr-2">🎨</span>
              Create Your Own Emoji
            </button>
          </div>
        </div>
      </section>
      </div>
    );
  }



export default Hero; 