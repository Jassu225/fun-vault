import { getDb } from '../services/firebaseAdmin';

async function testFirestoreConnection() {
  try {
    console.log('Testing Firestore connection...');

    const db = getDb();
    console.log('✅ Firebase Admin SDK initialized successfully');

    // Test creating a collection reference
    const testCollection = db.collection('test');
    console.log('✅ Collection reference created');

    // Test reading from collection (should work even if empty)
    const snapshot = await testCollection.get();
    console.log(`✅ Collection read successful. Size: ${snapshot.size}`);

    // Test creating a document
    const testDoc = testCollection.doc('test-doc');
    const testData = {
      message: 'Hello from test script',
      timestamp: new Date().toISOString(),
    };

    await testDoc.set(testData);
    console.log('✅ Document write successful');

    // Test reading the document
    const docSnapshot = await testDoc.get();
    if (docSnapshot.exists) {
      console.log('✅ Document read successful');
      console.log('Document data:', docSnapshot.data());
    }

    // Clean up
    await testDoc.delete();
    console.log('✅ Document cleanup successful');

    console.log('🎉 All Firestore operations successful!');
    return true;
  } catch (error) {
    console.error('❌ Firestore connection test failed:', error);
    return false;
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testFirestoreConnection().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

export { testFirestoreConnection };
