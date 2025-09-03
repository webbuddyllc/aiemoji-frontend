const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// Update existing users with subscription data
async function updateExistingUsers() {
  const uri = process.env.MONGODB_URI;

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

    // Find all users without subscription data
    const usersWithoutSubscription = await users.find({ subscription: { $exists: false } }).toArray();
    console.log(`\n📊 Found ${usersWithoutSubscription.length} users without subscription data`);

    if (usersWithoutSubscription.length === 0) {
      console.log('✅ All users already have subscription data!');
      return;
    }

    // Update each user with default subscription data
    let updatedCount = 0;
    for (const user of usersWithoutSubscription) {
      const result = await users.updateOne(
        { _id: user._id },
        {
          $set: {
            subscription: {
              planType: 'FREE',
              billingFrequency: 'monthly',
              status: 'active',
              usageCount: 0,
              usageLimit: 5,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          }
        }
      );

      if (result.modifiedCount > 0) {
        updatedCount++;
        console.log(`✅ Updated user: ${user.name} (${user.email})`);
      }
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} users with subscription data`);

    // Verify the updates
    const allUsers = await users.find({}).toArray();
    console.log('\n📋 Final verification:');
    allUsers.forEach((user, index) => {
      const hasSubscription = !!user.subscription;
      const planType = user.subscription?.planType || 'NOT SET';
      const billingFrequency = user.subscription?.billingFrequency || 'NOT SET';
      console.log(`👤 User ${index + 1}: ${user.name} - Subscription: ${hasSubscription ? '✅' : '❌'} (Plan: ${planType}, Frequency: ${billingFrequency})`);
    });

  } catch (error) {
    console.error('❌ Update failed:', error);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

updateExistingUsers();
