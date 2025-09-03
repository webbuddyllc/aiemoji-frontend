const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// Check current database state
async function checkDatabaseState() {
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

    // Get all users
    const allUsers = await users.find({}).toArray();
    console.log(`\n📊 Found ${allUsers.length} users in database\n`);

    allUsers.forEach((user, index) => {
      console.log(`👤 User ${index + 1}: ${user.name} (${user.email})`);
      console.log(`  📧 Email: ${user.email}`);
      console.log(`  🆔 ID: ${user._id}`);

      if (user.subscription) {
        console.log(`  💳 Subscription:`);
        console.log(`    - Plan Type: ${user.subscription.planType || 'NOT SET'}`);
        console.log(`    - Billing Frequency: ${user.subscription.billingFrequency || 'NOT SET'}`);
        console.log(`    - Status: ${user.subscription.status || 'NOT SET'}`);
        console.log(`    - Usage: ${user.subscription.usageCount || 0}/${user.subscription.usageLimit || 5}`);
        if (user.subscription.createdAt) {
          console.log(`    - Created: ${user.subscription.createdAt}`);
        }
        if (user.subscription.updatedAt) {
          console.log(`    - Updated: ${user.subscription.updatedAt}`);
        }
      } else {
        console.log(`  ❌ No subscription data found!`);
      }
      console.log(''); // Empty line for readability
    });

    // Check for users without subscription data
    const usersWithoutSubscription = allUsers.filter(user => !user.subscription);
    if (usersWithoutSubscription.length > 0) {
      console.log(`⚠️  ${usersWithoutSubscription.length} users don't have subscription data`);
      console.log('These users need to be updated with default subscription data');
    }

    // Check for users with incomplete subscription data
    const usersWithIncompleteSubscription = allUsers.filter(user => {
      if (!user.subscription) return false;
      return !user.subscription.billingFrequency || !user.subscription.createdAt;
    });

    if (usersWithIncompleteSubscription.length > 0) {
      console.log(`⚠️  ${usersWithIncompleteSubscription.length} users have incomplete subscription data`);
    }

  } catch (error) {
    console.error('❌ Database check failed:', error);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

checkDatabaseState();
