import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

// Environment variables - server-side access
const REPLICATE_API_TOKEN = process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN;
const REPLICATE_MODEL_ID = "fofr/sdxl-emoji";
const REPLICATE_MODEL_VERSION = "dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e";

// Emoji prefixes to add to user prompts
const EMOJI_PREFIXES = ['✨', '🎨', '🌟', '💫', '🔮', '🎭', '🎪', '🎯', '🎮', '🎲'];

// Initialize Replicate client
const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

export interface EmojiMetadata {
  prompt: string;
  dimensions: string;
  model: string;
  date: string;
  replicatePredictionId?: string;
  requestId?: string;
  processedAt?: string;
}

export interface StyledEmoji {
  emoji: string;
  isImage?: boolean;
  metadata?: EmojiMetadata;
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

export async function POST(request: NextRequest) {
  const clientRequestId = Math.random().toString(36).substring(7);
  console.log(`[${clientRequestId}] Starting server-side emoji generation request`);

  try {
    const body = await request.json();
    const { prompt, userId } = body;

    // Input validation
    if (!prompt || typeof prompt !== 'string') {
      console.error(`[${clientRequestId}] Invalid input type:`, typeof prompt);
      return NextResponse.json({
        success: false,
        error: 'Invalid input: Prompt is required and must be a string',
        errorType: 'INVALID_INPUT',
        details: { receivedType: typeof prompt },
        metadata: {
          requestId: clientRequestId,
          processedAt: new Date().toISOString()
        }
      }, { status: 400 });
    }

    if (prompt.length > 100) {
      console.error(`[${clientRequestId}] Prompt too long:`, prompt.length);
      return NextResponse.json({
        success: false,
        error: 'Prompt is too long (maximum 100 characters)',
        errorType: 'INVALID_INPUT',
        details: { maxLength: 100, actualLength: prompt.length },
        metadata: {
          requestId: clientRequestId,
          processedAt: new Date().toISOString()
        }
      }, { status: 400 });
    }

    // Pricing validation - check user subscription and usage limits
    if (userId) {
      console.log(`[${clientRequestId}] Validating user pricing for:`, userId);

      try {
        const client = await clientPromise;
        const db = client.db('emojify');
        const users = db.collection('users');

        const user = await users.findOne({ _id: new ObjectId(userId) });

        if (!user) {
          console.error(`[${clientRequestId}] User not found:`, userId);
          return NextResponse.json({
            success: false,
            error: 'User not found',
            errorType: 'USER_NOT_FOUND',
            metadata: {
              requestId: clientRequestId,
              processedAt: new Date().toISOString()
            }
          }, { status: 404 });
        }

        const subscription = user.subscription || {
          planType: 'FREE',
          usageCount: 0,
          usageLimit: 5,
          status: 'active'
        };

        // Check if user is on premium plan
        if (subscription.planType !== 'PREMIUM') {
          // Check usage limit for free users
          if (subscription.usageCount >= subscription.usageLimit) {
            console.log(`[${clientRequestId}] Usage limit reached for user:`, userId);
            return NextResponse.json({
              success: false,
              error: 'Monthly generation limit reached. Upgrade to Premium for unlimited access.',
              errorType: 'USAGE_LIMIT_REACHED',
              details: {
                usageCount: subscription.usageCount,
                usageLimit: subscription.usageLimit,
                planType: subscription.planType
              },
              metadata: {
                requestId: clientRequestId,
                processedAt: new Date().toISOString()
              }
            }, { status: 429 });
          }

          // Increment usage count for free users
          const newUsageCount = (subscription.usageCount || 0) + 1;
          await users.updateOne(
            { _id: new ObjectId(userId) },
            {
              $set: {
                'subscription.usageCount': newUsageCount,
                'subscription.updatedAt': new Date()
              }
            }
          );

          console.log(`[${clientRequestId}] Usage incremented for user:`, userId, `(${newUsageCount}/${subscription.usageLimit})`);
        } else {
          console.log(`[${clientRequestId}] Premium user validated:`, userId);
        }

      } catch (error) {
        console.error(`[${clientRequestId}] Pricing validation error:`, error);
        return NextResponse.json({
          success: false,
          error: 'Failed to validate user subscription',
          errorType: 'PRICING_VALIDATION_ERROR',
          details: {
            message: error instanceof Error ? error.message : 'Unknown error'
          },
          metadata: {
            requestId: clientRequestId,
            processedAt: new Date().toISOString()
          }
        }, { status: 500 });
      }
    } else {
      console.log(`[${clientRequestId}] No user ID provided - allowing generation for anonymous users`);
    }

    // Check if Replicate API token is configured
    if (!REPLICATE_API_TOKEN) {
      console.error(`[${clientRequestId}] Replicate API token not configured`);
      return NextResponse.json({
        success: false,
        error: 'Replicate API token is not configured. Please set NEXT_PUBLIC_REPLICATE_API_TOKEN in your environment variables.',
        errorType: 'CONFIGURATION_ERROR',
        details: { missingConfig: 'NEXT_PUBLIC_REPLICATE_API_TOKEN' },
        metadata: {
          requestId: clientRequestId,
          processedAt: new Date().toISOString()
        }
      }, { status: 500 });
    }

    console.log(`[${clientRequestId}] Processing prompt:`, prompt);

    const startTime = Date.now();

    // Enhanced emoji generation with SDXL emoji model
    const randomEmojiPrefix = EMOJI_PREFIXES[Math.floor(Math.random() * EMOJI_PREFIXES.length)];
    const enhancedPrompt = `A TOK emoji of ${prompt}`;

    console.log(`[${clientRequestId}] Enhanced prompt for Replicate:`, enhancedPrompt);

    // Call Replicate API directly using replicate.run
    console.log(`[${clientRequestId}] Calling Replicate API with model: ${REPLICATE_MODEL_ID}`);
    console.log(`[${clientRequestId}] Full model string: ${REPLICATE_MODEL_ID}:${REPLICATE_MODEL_VERSION}`);
    console.log(`[${clientRequestId}] Enhanced prompt:`, enhancedPrompt);

    let output;
    try {
      output = await replicate.run(
        `${REPLICATE_MODEL_ID}:${REPLICATE_MODEL_VERSION}`,
        {
          input: {
            width: 1024,
            height: 1024,
            prompt: enhancedPrompt,
            refine: "no_refiner",
            scheduler: "K_EULER",
            lora_scale: 0.6,
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
      console.log(`[${clientRequestId}] Replicate.run() completed successfully`);
    } catch (replicateError) {
      console.error(`[${clientRequestId}] Replicate.run() failed:`, replicateError);
      return NextResponse.json({
        success: false,
        error: 'Replicate API call failed: ' + (replicateError instanceof Error ? replicateError.message : 'Unknown error'),
        errorType: 'REPLICATE_API_ERROR',
        details: {
          replicateError: replicateError instanceof Error ? replicateError.message : replicateError,
          model: `${REPLICATE_MODEL_ID}:${REPLICATE_MODEL_VERSION}`
        },
        metadata: {
          requestId: clientRequestId,
          processedAt: new Date().toISOString()
        }
      }, { status: 500 });
    }

    const responseTime = Date.now() - startTime;
    console.log(`[${clientRequestId}] Replicate API response time:`, responseTime + 'ms');
    console.log(`[${clientRequestId}] Replicate output:`, output);

    // The output should be an array with image URL(s)
    if (!Array.isArray(output) || output.length === 0) {
      console.error(`[${clientRequestId}] No output received from Replicate`);
      return NextResponse.json({
        success: false,
        error: 'No emoji image was generated',
        errorType: 'NO_OUTPUT',
        details: {
          output: output
        },
        metadata: {
          requestId: clientRequestId,
          processedAt: new Date().toISOString()
        }
      }, { status: 500 });
    }

    // Get the generated image URL
    console.log(`[${clientRequestId}] Raw output from Replicate:`, JSON.stringify(output, null, 2));
    
    // Handle different output formats from SDXL model
    let imageUrl: string;
    if (Array.isArray(output) && output.length > 0) {
      // Check if output[0] is a string URL or an object with url() method
      if (typeof output[0] === 'string') {
        imageUrl = output[0];
      } else if (output[0] && typeof output[0] === 'object') {
        // Try different ways to get the URL
        if (typeof output[0].url === 'function') {
          // Call url() as a function (based on your example)
          imageUrl = output[0].url();
        } else if (typeof output[0].url === 'string') {
          // Access url as a property
          imageUrl = output[0].url;
        } else if (output[0].toString && typeof output[0].toString === 'function') {
          // Try toString method
          imageUrl = output[0].toString();
        } else {
          console.error(`[${clientRequestId}] Unexpected output format:`, output[0]);
          console.error(`[${clientRequestId}] Available properties:`, Object.keys(output[0]));
          return NextResponse.json({
            success: false,
            error: 'Unexpected output format from Replicate',
            errorType: 'OUTPUT_FORMAT_ERROR',
            details: {
              output: output,
              outputType: typeof output[0],
              availableProperties: Object.keys(output[0] || {})
            },
            metadata: {
              requestId: clientRequestId,
              processedAt: new Date().toISOString()
            }
          }, { status: 500 });
        }
      } else {
        console.error(`[${clientRequestId}] Output[0] is not an object or string:`, typeof output[0]);
        return NextResponse.json({
          success: false,
          error: 'Invalid output type from Replicate',
          errorType: 'OUTPUT_TYPE_ERROR',
          details: {
            output: output,
            outputType: typeof output[0]
          },
          metadata: {
            requestId: clientRequestId,
            processedAt: new Date().toISOString()
          }
        }, { status: 500 });
      }
    } else {
      console.error(`[${clientRequestId}] No valid output received`);
      return NextResponse.json({
        success: false,
        error: 'No valid output received from Replicate',
        errorType: 'NO_OUTPUT',
        details: {
          output: output
        },
        metadata: {
          requestId: clientRequestId,
          processedAt: new Date().toISOString()
        }
      }, { status: 500 });
    }
    
    console.log(`[${clientRequestId}] Extracted image URL:`, imageUrl);

    // Create metadata for the generated emoji
    const generatedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const metadata: EmojiMetadata = {
      prompt: prompt,
      dimensions: '1024×1024',
      model: 'Emoji',
      date: generatedDate,
    };

    const emoji: StyledEmoji = {
      emoji: imageUrl,
      isImage: true,
      metadata: metadata,
    };

    // Log the activity if user is authenticated
    if (userId) {
      try {
        const client = await clientPromise;
        const db = client.db('emojify');
        const activities = db.collection('user_activities');
        
        await activities.insertOne({
          userId: new ObjectId(userId),
          type: 'emoji_created',
          description: `Created new emoji: ${prompt}`,
          metadata: {
            emojiUrl: imageUrl,
            prompt: prompt,
            model: metadata.model,
            dimensions: metadata.dimensions
          },
          timestamp: new Date()
        });
      } catch (activityError) {
        console.error(`[${clientRequestId}] Failed to log activity:`, activityError);
        // Don't fail the request if activity logging fails
      }
    }

    console.log(`[${clientRequestId}] Successfully generated emoji:`, {
      url: imageUrl,
      metadata: metadata
    });

    return NextResponse.json({
      success: true,
      emoji: emoji,
      prompt: prompt,
      metadata: {
        requestId: clientRequestId,
        processedAt: new Date().toISOString(),
      },
      clientMetadata: {
        clientRequestId,
        responseTime,
      }
    });

  } catch (error) {
    console.error(`[${clientRequestId}] Unexpected error in server-side emoji generation:`, error);

    const isError = error instanceof Error;

    // Handle specific Replicate errors
    if (isError && error.message?.includes('Insufficient credit')) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient credits in your Replicate account. Please add credits to your account at https://replicate.com/account/billing',
        errorType: 'INSUFFICIENT_CREDITS',
        details: {
          message: error.message,
          stack: error.stack,
          errorType: error.constructor.name,
        },
        metadata: {
          requestId: clientRequestId,
          processedAt: new Date().toISOString()
        }
      }, { status: 402 });
    }

    return NextResponse.json({
      success: false,
      error: isError ? error.message : 'An unexpected error occurred during emoji generation',
      errorType: 'REPLICATE_ERROR',
      details: {
        message: isError ? error.message : 'Unknown error occurred',
        stack: isError ? error.stack : undefined,
        errorType: isError ? error.constructor.name : 'Unknown',
      },
      metadata: {
        requestId: clientRequestId,
        processedAt: new Date().toISOString()
      }
    }, { status: 500 });
  }
}
