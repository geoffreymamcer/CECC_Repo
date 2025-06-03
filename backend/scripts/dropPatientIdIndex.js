// Script to drop the patientId index from the User collection
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Only run the function after connection is established
    dropPatientIdIndex();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Drop the patientId index
const dropPatientIdIndex = async () => {
  try {
    // Wait for connection to be ready
    if (mongoose.connection.readyState !== 1) {
      console.log('Waiting for MongoDB connection...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return dropPatientIdIndex();
    }

    // Access the User collection directly
    const db = mongoose.connection.db;
    
    // Check if the users collection exists
    const collections = await db.listCollections({ name: 'users' }).toArray();
    
    if (collections.length > 0) {
      // Check if the index exists
      const indexes = await db.collection('users').indexes();
      console.log('Available indexes:', indexes);
      
      const patientIdIndex = indexes.find(index => index.name === 'patientId_1');
      
      if (patientIdIndex) {
        await db.collection('users').dropIndex('patientId_1');
        console.log('Successfully dropped patientId index');
      } else {
        console.log('patientId index does not exist');
      }
    } else {
      console.log('Users collection does not exist');
    }
    
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error dropping patientId index:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

