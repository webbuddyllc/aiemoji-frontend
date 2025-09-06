const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// Final verification of subscription data implementation
async function finalVerification() {
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

    // Get all users and verify subscription data
    const allUsers = await users.find({}).toArray();
    console.log(`\n📊 Final Verification - ${allUsers.length} users in database\n`);

    let validSubscriptions = 0;
    let usersWithBillingFrequency = 0;

    allUsers.forEach((user, index) => {
      console.log(`👤 User ${index + 1}: ${user.name}`);
      console.log(`  📧 Email: ${user.email}`);

      if (user.subscription) {
        console.log(`  💳 Subscription Status: ✅ PRESENT`);

        const sub = user.subscription;
        const requiredFields = ['planType', 'billingFrequency', 'status', 'usageCount', 'usageLimit'];

        console.log(`  📋 Plan Type: ${sub.planType || 'MISSING'}`);
        console.log(`  💰 Billing Frequency: ${sub.billingFrequency || 'MISSING'}`);
        console.log(`  📊 Status: ${sub.status || 'MISSING'}`);
        console.log(`  🔢 Usage: ${sub.usageCount || 0}/${sub.usageLimit || 5}`);
        console.log(`  🕒 Created: ${sub.createdAt ? '✅' : '❌'}`);
        console.log(`  🔄 Updated: ${sub.updatedAt ? '✅' : '❌'}`);

        // Check if all required fields are present
        const hasAllFields = requiredFields.every(field => sub[field] !== undefined);
        if (hasAllFields) {
          validSubscriptions++;
          console.log(`  ✅ VALID: All required subscription fields present`);
        } else {
          console.log(`  ❌ INVALID: Missing required fields`);
        }

        // Check billing frequency
        if (sub.billingFrequency) {
          usersWithBillingFrequency++;
          console.log(`  ✅ BILLING FREQUENCY: ${sub.billingFrequency}`);
        } else {
          console.log(`  ❌ BILLING FREQUENCY: Missing`);
        }

      } else {
        console.log(`  ❌ Subscription Status: MISSING`);
      }
      console.log(''); // Empty line for readability
    });

    // Summary
    console.log('🎯 FINAL VERIFICATION SUMMARY');
    console.log('=' .repeat(40));
    console.log(`Total Users: ${allUsers.length}`);
    console.log(`Users with Valid Subscriptions: ${validSubscriptions}`);
    console.log(`Users with Billing Frequency: ${usersWithBillingFrequency}`);
    console.log(`Subscription Coverage: ${((validSubscriptions / allUsers.length) * 100).toFixed(1)}%`);

    if (validSubscriptions === allUsers.length && usersWithBillingFrequency === allUsers.length) {
      console.log('\n🎉 SUCCESS: All users have complete subscription data!');
      console.log('✅ Database schema implementation is COMPLETE');
      console.log('✅ Billing frequency support is WORKING');
      console.log('✅ Frontend should now display subscription data correctly');
    } else {
      console.log('\n⚠️  INCOMPLETE: Some users are missing subscription data');
      console.log('Run the update script again or check the auth API');
    }

  } catch (error) {
    console.error('❌ Verification failed:', error);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

finalVerification();



