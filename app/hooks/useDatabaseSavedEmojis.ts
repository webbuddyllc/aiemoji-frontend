'use client';

import { useState, useEffect, useCallback } from 'react';
import { StyledEmoji } from '../services/emojiService';
import { useUser } from '../context/UserContext';

export interface SavedEmoji extends StyledEmoji {
  id: string;
  savedAt: string;
  originalPrompt: string;
}

export const useDatabaseSavedEmojis = () => {
  const { user } = useUser();
  const [savedEmojis, setSavedEmojis] = useState<SavedEmoji[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch saved emojis from database
  const fetchSavedEmojis = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/saved-emojis');
      if (response.ok) {
        const data = await response.json();
        setSavedEmojis(data.savedEmojis || []);
      }
    } catch (error) {
      console.error('Failed to fetch saved emojis:', error);
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  }, [user]);

  // Load saved emojis when user is available
  useEffect(() => {
    fetchSavedEmojis();
  }, [fetchSavedEmojis]);

  const saveEmoji = useCallback(async (emoji: StyledEmoji, originalPrompt: string) => {
    if (!user) return null;

    try {
      const response = await fetch('/api/saved-emojis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emoji: emoji.emoji,
          originalPrompt,
          metadata: emoji.metadata,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh the list to get the latest data
        await fetchSavedEmojis();
        return data.savedEmoji.id;
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save emoji');
      }
    } catch (error) {
      console.error('Failed to save emoji:', error);
      throw error;
    }
  }, [user, fetchSavedEmojis]);

  const unsaveEmoji = useCallback(async (id: string) => {
    if (!user) return;

    try {
      const response = await fetch('/api/saved-emojis', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emojiId: id }),
      });

      if (response.ok) {
        // Remove from local state immediately for better UX
        setSavedEmojis(prev => prev.filter(emoji => emoji.id !== id));
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove emoji');
      }
    } catch (error) {
      console.error('Failed to remove emoji:', error);
      throw error;
    }
  }, [user]);

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
    isLoading,
    refreshSavedEmojis: fetchSavedEmojis,
  };
};
