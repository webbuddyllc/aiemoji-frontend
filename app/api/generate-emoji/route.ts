import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

// Environment variables - server-side access
const REPLICATE_API_TOKEN = process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN;
const REPLICATE_MODEL_VERSION = process.env.NEXT_PUBLIC_REPLICATE_MODEL_VERSION || 'stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf';

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

    // Enhanced 3D emoji generation - professional 3D rendering style
    const enhancedPrompt = `${prompt}, 3D emoji, three dimensional, volumetric lighting, depth of field, shadows, highlights, glossy surface, metallic sheen, cute character, colorful, high detail, digital art, rendered in 3D, volumetric, dimensional, 3D model, isometric perspective, professional 3D render, ray tracing, subsurface scattering`;

    console.log(`[${clientRequestId}] Enhanced prompt for Replicate:`, enhancedPrompt);

    // Call Replicate API directly
    console.log(`[${clientRequestId}] Calling Replicate API with model:`, REPLICATE_MODEL_VERSION);

    const prediction = await replicate.predictions.create({
      version: REPLICATE_MODEL_VERSION,
      input: {
        prompt: enhancedPrompt,
        negative_prompt: "flat, 2D, cartoon, sketch, drawing, illustration, painting, low poly, voxel, pixel art, ugly, deformed, blurry, low quality, text, watermark, signature",
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
      return NextResponse.json({
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
      }, { status: 500 });
    }

    if (!finalPrediction.output || !Array.isArray(finalPrediction.output) || finalPrediction.output.length === 0) {
      console.error(`[${clientRequestId}] No output received from Replicate`);
      return NextResponse.json({
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
      }, { status: 500 });
    }

    // Get the generated image URL
    const imageUrl = finalPrediction.output[0];
    console.log(`[${clientRequestId}] Generated image URL:`, imageUrl);

    // Create metadata for the generated emoji
    const metadata: EmojiMetadata = {
      prompt: prompt,
      dimensions: '768x768',
      model: 'Replicate 3D Emoji Generator',
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

    return NextResponse.json({
      success: true,
      emoji: emoji,
      prompt: prompt,
      metadata: {
        requestId: clientRequestId,
        processedAt: new Date().toISOString(),
        replicatePredictionId: prediction.id,
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
