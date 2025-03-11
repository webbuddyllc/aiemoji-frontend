import { Request, Response } from 'express';

// Predefined emoji combinations with styles
const EMOJI_STYLES = [
  { background: 'linear-gradient(135deg, #FF6B6B, #FFE66D)', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' },
  { background: 'linear-gradient(135deg, #4ECDC4, #556270)', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' },
  { background: 'linear-gradient(135deg, #9B59B6, #3498DB)', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' },
];

// Map of keywords to emojis
const EMOJI_MAP: { [key: string]: string[] } = {
  'happy': ['😊', '😄', '😃'],
  'sad': ['😢', '😭', '😔'],
  'love': ['❤️', '💖', '💝'],
  'angry': ['😠', '😡', '💢'],
  'cool': ['😎', '🆒', '🕶️'],
  'party': ['🎉', '🎊', '🎈'],
  'food': ['🍕', '🍔', '🍟'],
  'animal': ['🐶', '🐱', '🐼'],
  'nature': ['🌺', '🌸', '🌼'],
  'weather': ['☀️', '🌧️', '⛈️'],
  'sport': ['⚽', '🏀', '🎾'],
  'music': ['🎵', '🎶', '🎸'],
  'travel': ['✈️', '🚗', '🚂'],
  'work': ['💼', '💻', '📱'],
  'sleep': ['😴', '💤', '🛏️'],
  'study': ['📚', '✏️', '📝'],
  'magic': ['✨', '🌟', '💫'],
  'cat': ['😺', '😸', '😻'],
  'dog': ['🐕', '🐶', '��'],
  'default': ['🎨', '🎯', '🎪']
};

// Error types for better error handling
enum EmojiErrorType {
  INVALID_INPUT = 'INVALID_INPUT',
  PROCESSING_ERROR = 'PROCESSING_ERROR',
  NO_MATCHES = 'NO_MATCHES',
  EMOJI_VALIDATION_ERROR = 'EMOJI_VALIDATION_ERROR',
  UNKNOWN = 'UNKNOWN'
}

interface EmojiError {
  type: EmojiErrorType;
  message: string;
  details?: any;
}

// Validate if a string is a valid emoji
const isValidEmoji = (str: string): boolean => {
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  return emojiRegex.test(str) && str.trim() === str;
};

// Validate emoji array
const validateEmojis = (emojis: string[]): string[] => {
  return emojis.filter(emoji => isValidEmoji(emoji));
};

export const generateEmoji = async (req: Request, res: Response) => {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] Starting emoji generation request`);

  try {
    const { text } = req.body;

    // Input validation
    if (!text || typeof text !== 'string') {
      const error: EmojiError = {
        type: EmojiErrorType.INVALID_INPUT,
        message: 'Invalid input: Text is required and must be a string',
        details: { receivedType: typeof text }
      };
      console.error(`[${requestId}] Input validation failed:`, error);
      return res.status(400).json({
        success: false,
        error: error.message,
        errorType: error.type,
        details: error.details
      });
    }

    if (text.length > 100) {
      const error: EmojiError = {
        type: EmojiErrorType.INVALID_INPUT,
        message: 'Text is too long',
        details: { maxLength: 100, actualLength: text.length }
      };
      console.error(`[${requestId}] Input validation failed:`, error);
      return res.status(400).json({
        success: false,
        error: error.message,
        errorType: error.type,
        details: error.details
      });
    }

    console.log(`[${requestId}] Processing text prompt:`, text);

    // Convert text to lowercase and split into words
    const words = text.toLowerCase().split(' ');
    console.log(`[${requestId}] Parsed words:`, words);
    
    // Find matching emojis from our map
    let selectedEmojis: string[] = [];
    const matchedWords: string[] = [];
    
    // Try to find emojis for each word in the input
    for (const word of words) {
      if (EMOJI_MAP[word]) {
        const validEmojis = validateEmojis(EMOJI_MAP[word]);
        if (validEmojis.length > 0) {
          selectedEmojis = selectedEmojis.concat(validEmojis);
          matchedWords.push(word);
        }
      }
    }

    console.log(`[${requestId}] Matched words:`, matchedWords);
    console.log(`[${requestId}] Selected emojis before processing:`, selectedEmojis);

    // If no matches found, use default emojis
    if (selectedEmojis.length === 0) {
      console.log(`[${requestId}] No matches found, using default emojis`);
      selectedEmojis = validateEmojis(EMOJI_MAP['default']);
      
      // If default emojis are invalid, return error
      if (selectedEmojis.length === 0) {
        const error: EmojiError = {
          type: EmojiErrorType.EMOJI_VALIDATION_ERROR,
          message: 'Failed to generate valid emojis',
          details: { reason: 'Default emojis are invalid' }
        };
        console.error(`[${requestId}] Emoji validation failed:`, error);
        return res.status(500).json({
          success: false,
          error: error.message,
          errorType: error.type,
          details: error.details
        });
      }
    }

    // Take only up to 3 unique emojis
    const uniqueEmojis = [...new Set(selectedEmojis)].slice(0, 3);
    console.log(`[${requestId}] Final unique emojis:`, uniqueEmojis);

    // Add random styles to each emoji
    const emojisWithStyles = uniqueEmojis.map(emoji => {
      const style = EMOJI_STYLES[Math.floor(Math.random() * EMOJI_STYLES.length)];
      return { emoji, style };
    });

    console.log(`[${requestId}] Successfully generated styled emojis`);

    return res.status(200).json({
      success: true,
      emojis: emojisWithStyles,
      prompt: text,
      metadata: {
        requestId,
        matchedWords,
        totalMatches: selectedEmojis.length,
        uniqueMatches: uniqueEmojis.length,
        processedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error(`[${requestId}] Error generating emoji:`, {
      error,
      stack: error instanceof Error ? error.stack : undefined
    });

    const emojiError: EmojiError = {
      type: EmojiErrorType.PROCESSING_ERROR,
      message: 'Failed to generate emoji',
      details: {
        errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
        errorStack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      }
    };

    return res.status(500).json({
      success: false,
      error: emojiError.message,
      errorType: emojiError.type,
      details: emojiError.details,
      requestId
    });
  }
}; 