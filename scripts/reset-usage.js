#!/usr/bin/env node

/**
 * Usage Reset Script
 *
 * This script resets monthly usage counts for free users.
 * Run this script at the beginning of each month using a cron job:
 *
 * 0 0 1 * * /path/to/node /path/to/reset-usage.js
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/emojify';

async function resetUsage() {
  console.log('🚀 Starting monthly usage reset...');

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('📱 Connected to MongoDB');

    const db = client.db('emojify');
    const users = db.collection('users');

    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    console.log(`📅 Reset date: ${currentDate.toISOString()}`);
    console.log(`📆 Month start: ${firstDayOfMonth.toISOString()}`);

    // Reset usage for free users
    const result = await users.updateMany(
      {
        'subscription.planType': 'FREE',
        $or: [
          { 'subscription.lastReset': { $lt: firstDayOfMonth } },
          { 'subscription.lastReset': { $exists: false } }
        ]
      },
      {
        $set: {
          'subscription.usageCount': 0,
          'subscription.lastReset': currentDate,
          'subscription.updatedAt': currentDate
        }
      }
    );

    console.log(`✅ Usage reset completed:`);
    console.log(`   - ${result.modifiedCount} free users had their usage reset`);
    console.log(`   - ${result.matchedCount} free users were found`);

    // Log the reset event
    const logs = db.collection('usage_logs');
    await logs.insertOne({
      type: 'MONTHLY_RESET',
      timestamp: currentDate,
      usersAffected: result.modifiedCount,
      usersFound: result.matchedCount,
      resetDate: firstDayOfMonth
    });

    console.log('📝 Reset event logged');

  } catch (error) {
    console.error('❌ Error during usage reset:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the reset if this script is executed directly
if (require.main === module) {
  resetUsage()
    .then(() => {
      console.log('🎉 Monthly usage reset completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Monthly usage reset failed:', error);
      process.exit(1);
    });
}

module.exports = { resetUsage };



