const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';
const REPLICATE_MODEL_VERSION = '5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa';

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
  console.log(`[${clientRequestId}] Starting emoji generation request`);

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

    // Call the backend API to generate emojis with Replicate
    console.log(`[${clientRequestId}] Calling backend API for Replicate emoji generation:`, `${API_URL}/emoji/generate`);
    
    // Log the request we're about to make
    console.log(`[${clientRequestId}] Request details:`, {
      url: `${API_URL}/emoji/generate`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Client-Request-ID': clientRequestId,
      },
      body: { text },
      mode: 'cors'
    });
    
    const startTime = Date.now();
    
    const response = await fetch(`${API_URL}/emoji/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Client-Request-ID': clientRequestId,
      },
      body: JSON.stringify({ text }),
      credentials: 'include',
      mode: 'cors'
    });

    const responseTime = Date.now() - startTime;
    console.log(`[${clientRequestId}] Backend API response time:`, responseTime + 'ms');
    console.log(`[${clientRequestId}] Backend API response status:`, response.status);
    console.log(`[${clientRequestId}] Backend API response headers:`, Object.fromEntries([...response.headers.entries()]));

    // Process the response
    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.error(`[${clientRequestId}] Backend API error response:`, errorData);
        
        return {
          success: false,
          error: errorData.error || `HTTP error! status: ${response.status}`,
          errorType: errorData.errorType || 'API_ERROR',
          details: {
            status: response.status,
            statusText: response.statusText,
            ...errorData.details
          },
          metadata: {
            ...errorData.metadata,
            requestId: clientRequestId,
            processedAt: new Date().toISOString()
          }
        };
      } catch (parseError) {
        // If we can't parse the error, return a generic error
        console.error(`[${clientRequestId}] Error parsing error response:`, parseError);
        
        return {
          success: false,
          error: `Backend error: ${response.status} ${response.statusText}`,
          errorType: 'API_ERROR',
          details: {
            status: response.status,
            statusText: response.statusText
          },
          metadata: {
            requestId: clientRequestId,
            processedAt: new Date().toISOString()
          }
        };
      }
    }

    // Parse successful response
    try {
      const data = await response.json();
      console.log(`[${clientRequestId}] Backend API successful response:`, {
        success: data.success,
        emoji: data.emoji,
        metadata: data.metadata,
      });

      if (!data.success || !data.emoji) {
        return {
          success: false,
          error: data.error || 'No emoji was generated',
          errorType: data.errorType || 'PROCESSING_ERROR',
          details: data.details || {},
          metadata: {
            ...data.metadata,
            requestId: clientRequestId,
            processedAt: new Date().toISOString()
          }
        };
      }

      // Return the successful response
      return {
        ...data,
        clientMetadata: {
          clientRequestId,
          responseTime,
        }
      };
    } catch (jsonError) {
      console.error(`[${clientRequestId}] Error parsing JSON response:`, jsonError);
      
      return {
        success: false,
        error: 'Failed to parse backend response',
        errorType: 'PARSING_ERROR',
        details: {
          message: jsonError instanceof Error ? jsonError.message : 'Unknown error',
          originalError: jsonError
        },
        metadata: {
          requestId: clientRequestId,
          processedAt: new Date().toISOString()
        }
      };
    }
  } catch (error) {
    console.error(`[${clientRequestId}] Unexpected error:`, error);
    
    return {
      success: false,
      error: 'An unexpected error occurred',
      errorType: 'UNKNOWN_ERROR',
      details: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        stack: error instanceof Error ? error.stack : undefined,
      },
      metadata: {
        requestId: clientRequestId,
        processedAt: new Date().toISOString()
      }
    };
  }
}; 