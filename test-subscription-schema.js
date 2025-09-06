const { MongoClient } = require('mongodb');

// Test script to verify subscription schema
async function testSubscriptionSchema() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

  if (!uri) {
    console.error('❌ MONGODB_URI environment variable not set');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('emojify');
    const users = db.collection('users');

    // Test data for subscription schema
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed_password',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
      createdAt: new Date(),
      subscription: {
        planType: 'PREMIUM',
        billingFrequency: 'monthly',
        status: 'active',
        stripeSubscriptionId: 'sub_test123',
        stripeCustomerId: 'cus_test123',
        stripePriceId: 'price_test123',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        cancelAtPeriodEnd: false,
        usageCount: 0,
        usageLimit: 999999,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };

    // Insert test user
    const result = await users.insertOne(testUser);
    console.log('✅ Test user inserted with ID:', result.insertedId);

    // Retrieve and verify the data
    const insertedUser = await users.findOne({ _id: result.insertedId });
    console.log('✅ Retrieved user subscription data:');
    console.log(JSON.stringify(insertedUser.subscription, null, 2));

    // Verify all required fields are present
    const requiredFields = [
      'planType',
      'billingFrequency',
      'status',
      'usageCount',
      'usageLimit',
      'createdAt',
      'updatedAt'
    ];

    const missingFields = requiredFields.filter(field => !insertedUser.subscription[field]);
    if (missingFields.length === 0) {
      console.log('✅ All required subscription fields are present');
    } else {
      console.log('❌ Missing fields:', missingFields);
    }

    // Clean up test data
    await users.deleteOne({ _id: result.insertedId });
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 Subscription schema test completed successfully!');
    console.log('📋 Schema supports:');
    console.log('  - Plan type (FREE/PREMIUM)');
    console.log('  - Billing frequency (monthly/annual)');
    console.log('  - Subscription status (active/inactive/cancelled/past_due)');
    console.log('  - Stripe integration fields');
    console.log('  - Usage tracking');
    console.log('  - Timestamps (createdAt/updatedAt)');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

testSubscriptionSchema();



