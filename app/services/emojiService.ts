// Note: Replicate API calls are now handled server-side via /api/generate-emoji route
// This avoids CORS issues and improves security

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

export const generateEmoji = async (text: string, userId?: string): Promise<EmojiResponse> => {
  const clientRequestId = Math.random().toString(36).substring(7);
  console.log(`[${clientRequestId}] Starting emoji generation request via server API`);

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

    console.log(`[${clientRequestId}] Processing text prompt:`, text);

    const startTime = Date.now();

    // Call server-side API route instead of Replicate directly
    console.log(`[${clientRequestId}] Calling server-side API route`);

    const requestBody: any = {
      prompt: text,
    };

    if (userId) {
      requestBody.userId = userId;
    }

    const response = await fetch('/api/generate-emoji', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseTime = Date.now() - startTime;
    console.log(`[${clientRequestId}] Server API response time:`, responseTime + 'ms');
    console.log(`[${clientRequestId}] Server API response status:`, response.status);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: 'Unknown server error' };
      }

      console.error(`[${clientRequestId}] Server API error:`, errorData);

      return {
        success: false,
        error: errorData.error || 'Failed to generate emoji',
        errorType: errorData.errorType || 'API_ERROR',
        details: errorData.details || {},
        metadata: {
          requestId: clientRequestId,
          processedAt: new Date().toISOString()
        }
      };
    }

    const data = await response.json();
    console.log(`[${clientRequestId}] Server API response:`, {
      success: data.success,
      hasEmoji: !!data.emoji,
      errorType: data.errorType,
    });

    if (data.success && data.emoji) {
      console.log(`[${clientRequestId}] Successfully generated emoji via server API:`, {
        url: data.emoji.emoji,
        metadata: data.emoji.metadata
      });

      return {
        success: true,
        emoji: data.emoji,
        prompt: data.prompt,
        metadata: data.metadata,
        clientMetadata: {
          clientRequestId,
          responseTime,
        }
      };
    } else {
      // Handle server-side error
      const errorMessage = data.error || 'Failed to generate emoji';
      console.error(`[${clientRequestId}] Error from server API:`, {
        error: errorMessage,
        type: data.errorType,
        details: data.details
      });

      return {
        success: false,
        error: errorMessage,
        errorType: data.errorType,
        details: data.details,
        metadata: {
          requestId: clientRequestId,
          processedAt: new Date().toISOString()
        }
      };
    }

  } catch (error) {
    console.error(`[${clientRequestId}] Unexpected error in emoji generation:`, error);

    // Handle network errors (like "Failed to fetch")
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error(`[${clientRequestId}] Network error - likely CORS or connectivity issue`);

      return {
        success: false,
        error: 'Network error: Unable to connect to the emoji generation service. Please check your internet connection and try again.',
        errorType: 'NETWORK_ERROR',
        details: {
          message: error.message,
          originalError: error,
        },
        metadata: {
          requestId: clientRequestId,
          processedAt: new Date().toISOString()
        }
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred during emoji generation',
      errorType: 'CLIENT_ERROR',
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