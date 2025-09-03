import Replicate from 'replicate';

// Environment variables - NEXT_PUBLIC_ prefix for client-side access
const REPLICATE_API_TOKEN = process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN;
const REPLICATE_MODEL_VERSION = process.env.NEXT_PUBLIC_REPLICATE_MODEL_VERSION || '5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa';

// Initialize Replicate client
const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

export interface EmojiStyle {
  background: string;
  textShadow: string;
}

export interface StyledEmoji {
  emoji: string;
  isImage?: boolean;
  metadata?: EmojiMetadata;
}

export interface EmojiMetadata {
  prompt: string;
  dimensions: string;
  model: string;
  date: string;
  replicatePredictionId?: string;
  requestId?: string;
  processedAt?: string;
}

export interface EmojiResponse {
  success: boolean;
  emoji?: StyledEmoji;
  prompt?: string;
  error?: string;
  errorType?: string;
  details?: any;
  metadata?: {
    requestId: string;
    processedAt: string;
    replicatePredictionId?: string;
  };
  clientMetadata?: {
    clientRequestId: string;
    responseTime: number;
  };
}

// Predefined emoji styles for styling generated emojis
const EMOJI_STYLES = [
  { background: 'linear-gradient(135deg, #FF6B6B, #FFE66D)', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' },
  { background: 'linear-gradient(135deg, #4ECDC4, #556270)', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' },
  { background: 'linear-gradient(135deg, #9B59B6, #3498DB)', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' },
];

// Custom error class for emoji generation
class EmojiGenerationError extends Error {
  constructor(
    message: string,
    public errorType: string,
    public details: any,
    public requestId?: string
  ) {
    super(message);
    this.name = 'EmojiGenerationError';
  }
}

export const generateEmoji = async (text: string): Promise<EmojiResponse> => {
  const clientRequestId = Math.random().toString(36).substring(7);
  console.log(`[${clientRequestId}] Starting emoji generation request with Replicate API`);

  try {
    // Input validation
    if (!text || typeof text !== 'string') {
      console.error(`[${clientRequestId}] Invalid input type:`, typeof text);
      return {
        success: false,
        error: 'Invalid input: Text is required and must be a string',
        errorType: 'INVALID_INPUT',
        details: { receivedType: typeof text },
        metadata: {
          requestId: clientRequestId,
          processedAt: new Date().toISOString()
        }
      };
    }

    if (text.length > 100) {
      console.error(`[${clientRequestId}] Text too long:`, text.length);
      return {
        success: false,
        error: 'Text is too long (maximum 100 characters)',
        errorType: 'INVALID_INPUT',
        details: { maxLength: 100, actualLength: text.length },
        metadata: {
          requestId: clientRequestId,
          processedAt: new Date().toISOString()
        }
      };
    }

    // Check if Replicate API token is configured
    if (!REPLICATE_API_TOKEN) {
      console.error(`[${clientRequestId}] Replicate API token not configured`);
      return {
        success: false,
        error: 'Replicate API token is not configured. Please set REPLICATE_API_TOKEN in your environment variables.',
        errorType: 'CONFIGURATION_ERROR',
        details: { missingConfig: 'REPLICATE_API_TOKEN' },
        metadata: {
          requestId: clientRequestId,
          processedAt: new Date().toISOString()
        }
      };
    }

    console.log(`[${clientRequestId}] Processing text prompt:`, text);

    const startTime = Date.now();

    // Enhanced prompt for 3D-style Fluent Emojis
    const enhancedPrompt = `Create a 3D-style Fluent emoji of ${text}. The emoji should have a modern, minimalist design with clean lines, subtle shadows, and a professional appearance. Use a white or transparent background. Make it suitable for digital communication platforms.`;

    console.log(`[${clientRequestId}] Enhanced prompt for Replicate:`, enhancedPrompt);

    // Call Replicate API directly
    console.log(`[${clientRequestId}] Calling Replicate API with model:`, REPLICATE_MODEL_VERSION);

    const prediction = await replicate.predictions.create({
      version: REPLICATE_MODEL_VERSION,
      input: {
        prompt: enhancedPrompt,
        negative_prompt: "blurry, low quality, distorted, ugly, poorly drawn, cartoon, anime, sketch, painting, watercolor, realistic, photorealistic, 3d render, sculpture, statue",
        width: 768,
        height: 768,
        num_inference_steps: 20,
        guidance_scale: 7.5,
        scheduler: "DPMSolverMultistep",
      },
    });

    console.log(`[${clientRequestId}] Replicate prediction created:`, prediction.id);

    // Wait for the prediction to complete
    let finalPrediction = prediction;
    while (finalPrediction.status !== 'succeeded' && finalPrediction.status !== 'failed') {
      console.log(`[${clientRequestId}] Prediction status:`, finalPrediction.status);
      await new Promise(resolve => setTimeout(resolve, 1000));

      finalPrediction = await replicate.predictions.get(prediction.id);
    }

    const responseTime = Date.now() - startTime;
    console.log(`[${clientRequestId}] Replicate API response time:`, responseTime + 'ms');
    console.log(`[${clientRequestId}] Final prediction status:`, finalPrediction.status);

    if (finalPrediction.status === 'failed') {
      console.error(`[${clientRequestId}] Replicate prediction failed:`, finalPrediction.error);
      return {
        success: false,
        error: 'Failed to generate emoji: ' + (finalPrediction.error || 'Unknown error'),
        errorType: 'GENERATION_FAILED',
        details: {
          replicateError: finalPrediction.error,
          predictionId: prediction.id
        },
        metadata: {
          requestId: clientRequestId,
          processedAt: new Date().toISOString()
        }
      };
    }

    if (!finalPrediction.output || !Array.isArray(finalPrediction.output) || finalPrediction.output.length === 0) {
      console.error(`[${clientRequestId}] No output received from Replicate`);
      return {
        success: false,
        error: 'No emoji image was generated',
        errorType: 'NO_OUTPUT',
        details: {
          predictionId: prediction.id,
          output: finalPrediction.output
        },
        metadata: {
          requestId: clientRequestId,
          processedAt: new Date().toISOString()
        }
      };
    }

    // Get the generated image URL
    const imageUrl = finalPrediction.output[0];
    console.log(`[${clientRequestId}] Generated image URL:`, imageUrl);

    // Create metadata for the generated emoji
    const metadata: EmojiMetadata = {
      prompt: text,
      dimensions: '768x768',
      model: 'Replicate 3D-Style Fluent Emoji',
      date: new Date().toISOString(),
    };

    const emoji: StyledEmoji = {
      emoji: imageUrl,
      isImage: true,
      metadata: metadata,
    };

    console.log(`[${clientRequestId}] Successfully generated emoji:`, {
      url: imageUrl,
      metadata: metadata
    });

    return {
      success: true,
      emoji: emoji,
      prompt: text,
      metadata: {
        requestId: clientRequestId,
        processedAt: new Date().toISOString(),
        replicatePredictionId: prediction.id,
      },
      clientMetadata: {
        clientRequestId,
        responseTime,
      }
    };

  } catch (error) {
    console.error(`[${clientRequestId}] Unexpected error in Replicate integration:`, error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred during emoji generation',
      errorType: 'REPLICATE_ERROR',
      details: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        stack: error instanceof Error ? error.stack : undefined,
        errorType: error instanceof Error ? error.constructor.name : 'Unknown',
      },
      metadata: {
        requestId: clientRequestId,
        processedAt: new Date().toISOString()
      }
    };
  }
}; 