#!/usr/bin/env node

/**
 * Test script for Replicate API integration
 * Run this script to verify your Replicate setup is working correctly
 */

const Replicate = require('replicate');
require('dotenv').config({ path: '.env.local' });

// Test configuration
const REPLICATE_API_TOKEN = process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN || process.env.REPLICATE_API_TOKEN;
const REPLICATE_MODEL_VERSION = process.env.REPLICATE_MODEL_VERSION || 'stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf';

async function testReplicateIntegration() {
  console.log('🔍 Testing Replicate API Integration...\n');

  // Check if API token is configured
  if (!REPLICATE_API_TOKEN) {
    console.error('❌ NEXT_PUBLIC_REPLICATE_API_TOKEN is not set in your .env.local file');
    console.log('📝 Please follow these steps:');
    console.log('   1. Go to https://replicate.com/account/api-tokens');
    console.log('   2. Create a new API token');
    console.log('   3. Add it to your .env.local file:');
    console.log('      NEXT_PUBLIC_REPLICATE_API_TOKEN=your_token_here');
    process.exit(1);
  }

  console.log('✅ API token found');

  try {
    // Initialize Replicate client
    console.log('🔧 Initializing Replicate client...');
    const replicate = new Replicate({
      auth: REPLICATE_API_TOKEN,
    });

    console.log('✅ Replicate client initialized');

    // Test with a simple emoji generation
    const testPrompt = 'happy cat';
    const enhancedPrompt = `${testPrompt}, 3D emoji, three dimensional, volumetric lighting, depth of field, shadows, highlights, glossy surface, metallic sheen, cute character, colorful, high detail, digital art, rendered in 3D, volumetric, dimensional, 3D model, isometric perspective, professional 3D render, ray tracing, subsurface scattering`;

    console.log(`🎨 Testing emoji generation with prompt: "${testPrompt}"`);

    const prediction = await replicate.predictions.create({
      version: REPLICATE_MODEL_VERSION,
      input: {
        prompt: enhancedPrompt,
        negative_prompt: "flat, 2D, cartoon, sketch, drawing, illustration, painting, low poly, voxel, pixel art, ugly, deformed, blurry, low quality, text, watermark, signature",
      },
    });

    console.log(`📡 Prediction created with ID: ${prediction.id}`);

    // Wait for completion
    console.log('⏳ Waiting for prediction to complete...');
    let finalPrediction = prediction;
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds timeout

    while (finalPrediction.status !== 'succeeded' && finalPrediction.status !== 'failed' && attempts < maxAttempts) {
      console.log(`   Status: ${finalPrediction.status} (attempt ${attempts + 1}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      finalPrediction = await replicate.predictions.get(prediction.id);
      attempts++;
    }

    if (finalPrediction.status === 'succeeded') {
      console.log('✅ Prediction completed successfully!');

      if (finalPrediction.output && Array.isArray(finalPrediction.output) && finalPrediction.output.length > 0) {
        console.log('🖼️  Generated image URL:', finalPrediction.output[0]);
        console.log('🎉 Replicate integration is working correctly!');
        console.log('\n💡 Your AI Emoji Generator is ready to use!');
        console.log('   Run "npm run dev" and visit http://localhost:3000');
      } else {
        console.error('❌ Prediction succeeded but no output was generated');
        console.log('Output:', finalPrediction.output);
      }
    } else if (finalPrediction.status === 'failed') {
      console.error('❌ Prediction failed:', finalPrediction.error);
      console.log('🔧 Check your model version or API token');
    } else {
      console.error('⏰ Prediction timed out after 60 seconds');
      console.log('💡 The model might be busy. Try again later.');
    }

  } catch (error) {
    console.error('❌ Error testing Replicate integration:');
    console.error(error.message);

    if (error.message.includes('authentication')) {
      console.log('\n🔐 Authentication failed. Please check:');
      console.log('   1. Your API token is correct');
      console.log('   2. Your Replicate account has credits');
      console.log('   3. The token has the right permissions');
    } else if (error.message.includes('model')) {
      console.log('\n🔧 Model error. Please check:');
      console.log('   1. The model version is correct');
      console.log('   2. The model is publicly available');
    }

    process.exit(1);
  }
}

// Run the test
testReplicateIntegration().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});
