'use client';

import { useState, useEffect, useCallback } from 'react';
import { StyledEmoji } from '../services/emojiService';

export interface SavedEmoji extends StyledEmoji {
  id: string;
  savedAt: string;
  originalPrompt: string;
}

const STORAGE_KEY = 'ai_emoji_saved';

export const useSavedEmojis = () => {
  const [savedEmojis, setSavedEmojis] = useState<SavedEmoji[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved emojis from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedEmojis(parsed);
      }
    } catch (error) {
      console.error('Failed to load saved emojis:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever savedEmojis changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedEmojis));
      } catch (error) {
        console.error('Failed to save emojis to localStorage:', error);
      }
    }
  }, [savedEmojis, isLoaded]);

  const saveEmoji = useCallback((emoji: StyledEmoji, originalPrompt: string) => {
    const savedEmoji: SavedEmoji = {
      ...emoji,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      savedAt: new Date().toISOString(),
      originalPrompt,
    };

    setSavedEmojis(prev => [savedEmoji, ...prev]);
    return savedEmoji.id;
  }, []);

  const unsaveEmoji = useCallback((id: string) => {
    setSavedEmojis(prev => prev.filter(emoji => emoji.id !== id));
  }, []);

  const isEmojiSaved = useCallback((emojiUrl: string) => {
    return savedEmojis.some(saved => saved.emoji === emojiUrl);
  }, [savedEmojis]);

  const getSavedEmojiId = useCallback((emojiUrl: string) => {
    const saved = savedEmojis.find(saved => saved.emoji === emojiUrl);
    return saved?.id || null;
  }, [savedEmojis]);

  return {
    savedEmojis,
    saveEmoji,
    unsaveEmoji,
    isEmojiSaved,
    getSavedEmojiId,
    isLoaded,
  };
};
