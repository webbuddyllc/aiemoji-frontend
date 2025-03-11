const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface EmojiStyle {
  background: string;
  textShadow: string;
}

export interface StyledEmoji {
  emoji: string;
  style: EmojiStyle;
}

export interface EmojiMetadata {
  requestId: string;
  matchedWords: string[];
  totalMatches: number;
  uniqueMatches: number;
  processedAt: string;
}

export interface EmojiResponse {
  success: boolean;
  emojis?: StyledEmoji[];
  prompt?: string;
  error?: string;
  errorType?: string;
  details?: any;
  metadata?: EmojiMetadata;
  clientMetadata?: {
    clientRequestId: string;
    responseTime: number;
  };
}

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
          clientRequestId,
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
          clientRequestId,
          processedAt: new Date().toISOString()
        }
      };
    }

    console.log(`[${clientRequestId}] Calling API:`, `${API_URL}/emoji/generate`);
    console.log(`[${clientRequestId}] Request payload:`, { text });

    const startTime = Date.now();
    
    try {
      const response = await fetch(`${API_URL}/emoji/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Client-Request-ID': clientRequestId,
        },
        body: JSON.stringify({ text }),
        credentials: 'include',
        mode: 'cors',
      });

      const responseTime = Date.now() - startTime;
      console.log(`[${clientRequestId}] API response time:`, responseTime + 'ms');

      const data = await response.json();
      console.log(`[${clientRequestId}] API Response:`, {
        success: data.success,
        emojiCount: data.emojis?.length,
        metadata: data.metadata,
      });

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP error! status: ${response.status}`,
          errorType: data.errorType || 'API_ERROR',
          details: {
            status: response.status,
            statusText: response.statusText,
            ...data.details
          },
          metadata: {
            ...data.metadata,
            clientRequestId,
            processedAt: new Date().toISOString()
          }
        };
      }

      if (!data.success || !data.emojis || data.emojis.length === 0) {
        return {
          success: false,
          error: data.error || 'No emojis generated',
          errorType: data.errorType || 'PROCESSING_ERROR',
          details: data.details || {},
          metadata: {
            ...data.metadata,
            clientRequestId,
            processedAt: new Date().toISOString()
          }
        };
      }

      return {
        ...data,
        clientMetadata: {
          clientRequestId,
          responseTime,
        }
      };

    } catch (fetchError) {
      console.error(`[${clientRequestId}] Fetch error:`, fetchError);
      return {
        success: false,
        error: 'Cannot connect to the server',
        errorType: 'CONNECTION_ERROR',
        details: {
          message: 'Please make sure the backend is running',
          originalError: fetchError instanceof Error ? fetchError.message : 'Unknown error'
        },
        metadata: {
          clientRequestId,
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
        clientRequestId,
        processedAt: new Date().toISOString()
      }
    };
  }
}; 