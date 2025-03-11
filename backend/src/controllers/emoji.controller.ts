import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import Replicate from 'replicate';

dotenv.config();

// Predefined emoji styles for styling generated emojis
const EMOJI_STYLES = [
  { background: 'linear-gradient(135deg, #FF6B6B, #FFE66D)', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' },
  { background: 'linear-gradient(135deg, #4ECDC4, #556270)', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' },
  { background: 'linear-gradient(135deg, #9B59B6, #3498DB)', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' },
];

// Replicate API configuration
const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;
const REPLICATE_MODEL_ID = "fofr/sdxl-emoji";
const REPLICATE_MODEL_VERSION = "dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e";

// Emoji prefixes to add to user prompts
const EMOJI_PREFIXES = ['✨', '🎨', '🌟', '💫', '🔮', '🎭', '🎪', '��', '🎮', '🎲'];

// If no Replicate Key is found, we'll use a fallback mechanism
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
  'dog': ['🐕', '🐶', '🐾'],
  'default': ['🎨', '🎯', '🎪']
};

// Error types for better error handling
enum EmojiErrorType {
  INVALID_INPUT = 'INVALID_INPUT',
  PROCESSING_ERROR = 'PROCESSING_ERROR',
  NO_MATCHES = 'NO_MATCHES',
  EMOJI_VALIDATION_ERROR = 'EMOJI_VALIDATION_ERROR',
  REPLICATE_API_ERROR = 'REPLICATE_API_ERROR',
  UNKNOWN = 'UNKNOWN'
}

interface EmojiError {
  type: EmojiErrorType;
  message: string;
  details?: any;
}

// Generate emoji through Replicate API
const generateEmojiWithReplicate = async (text: string, requestId: string): Promise<string> => {
  try {
    console.log(`[${requestId}] Generating emoji with Replicate API for prompt: "${text}"`);
    
    if (!REPLICATE_API_KEY) {
      throw new Error('Replicate API key is not configured');
    }

    // Select a random emoji prefix to add to the prompt
    const randomEmojiPrefix = EMOJI_PREFIXES[Math.floor(Math.random() * EMOJI_PREFIXES.length)];
    const enhancedPrompt = `detailed emoji of ${randomEmojiPrefix} ${text}, high quality, crisp details, 3D style, bright colors, clean background`;
    console.log(`[${requestId}] Enhanced prompt: "${enhancedPrompt}"`);
    
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    });

    console.log(`[${requestId}] Calling Replicate with model: ${REPLICATE_MODEL_ID}`);
    
    // Run the model with the enhanced prompt for a single high-quality emoji
    const output = await replicate.run(
      `${REPLICATE_MODEL_ID}:${REPLICATE_MODEL_VERSION}`,
      {
        input: {
          width: 768,
          height: 768, 
          prompt: enhancedPrompt,
          refine: "no_refiner",
          scheduler: "K_EULER",
          lora_scale: 0.8,
          num_outputs: 1,
          guidance_scale: 7.5,
          apply_watermark: false,
          high_noise_frac: 0.8,
          negative_prompt: "bad quality, low resolution, blurry, pixelated",
          prompt_strength: 0.8,
          num_inference_steps: 50
        }
      }
    );
    
    console.log(`[${requestId}] Replicate output:`, output);
    
    // The output should be an array with a single image URL
    if (Array.isArray(output) && output.length > 0) {
      return output[0];
    }
    
    throw new Error('Unexpected response format from Replicate');
    
  } catch (error) {
    console.error(`[${requestId}] Error generating emoji with Replicate:`, error);
    throw error;
  }
};

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

    // Try to generate emoji with Replicate API
    let emojiUrl: string;
    try {
      emojiUrl = await generateEmojiWithReplicate(text, requestId);
      console.log(`[${requestId}] Generated emoji URL from Replicate:`, emojiUrl);
    } catch (replicateError) {
      console.error(`[${requestId}] Replicate API error:`, replicateError);
      
      return res.status(500).json({
        success: false,
        error: 'Failed to generate emoji with Replicate API',
        errorType: EmojiErrorType.REPLICATE_API_ERROR,
        details: {
          message: replicateError instanceof Error ? replicateError.message : 'Unknown error occurred',
          apiKey: REPLICATE_API_KEY ? 'Configured' : 'Missing',
        }
      });
    }

    // Get current date for metadata
    const generatedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Format the emoji with metadata similar to the shown image
    const emojiData = {
      emoji: emojiUrl,
      isImage: true,
      metadata: {
        prompt: text,
        dimensions: "768×768",
        model: "Emoji",
        date: generatedDate
      }
    };

    console.log(`[${requestId}] Successfully generated emoji image`);

    return res.status(200).json({
      success: true,
      emoji: emojiData,
      prompt: text,
      metadata: {
        requestId,
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