import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Profile from '../models/Profile.js';
import MedicalHistory from '../models/MedicalHistory.js';
import Visit from '../models/Visit.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for migration'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const migrateData = async () => {
  try {
    console.log('Starting data migration...');
    
    // Get all profiles
    const profiles = await Profile.find({});
    console.log(`Found ${profiles.length} profiles to migrate`);
    
    let medicalHistoriesCreated = 0;
    let visitsCreated = 0;
    
    // Process each profile
    for (const profile of profiles) {
      // 1. Create medical history if profile has medical history data
      if (profile.ocularHistory || profile.healthHistory || profile.familyMedicalHistory || 
          profile.medications || profile.allergies || profile.occupationalHistory || profile.digitalHistory) {
        
        const medicalHistory = await MedicalHistory.create({
          patientId: profile.patientId,
          ocularHistory: profile.ocularHistory || '',
          healthHistory: profile.healthHistory || '',
          familyMedicalHistory: profile.familyMedicalHistory || '',
          medications: profile.medications || '',
          allergies: profile.allergies || '',
          occupationalHistory: profile.occupationalHistory || '',
          digitalHistory: profile.digitalHistory || ''
        });
        
        // Update profile with reference to medical history
        profile.medicalHistoryId = medicalHistory._id;
        medicalHistoriesCreated++;
      }
      
      // 2. Create visit record if profile has visit data
      if (profile.chiefComplaint || profile.associatedComplaint || profile.diagnosis || profile.treatmentPlan) {
        const visit = await Visit.create({
          patientId: profile.patientId,
          chiefComplaint: profile.chiefComplaint || '',
          associatedComplaint: profile.associatedComplaint || '',
          diagnosis: profile.diagnosis || '',
          treatmentPlan: profile.treatmentPlan || '',
          visitDate: new Date(), // Default to current date since we don't have historical data
          doctor: 'Dr. Philip Richard Budiongan' // Default doctor name
        });
        
        // Initialize visits array if it doesn't exist
        if (!profile.visits) {
          profile.visits = [];
        }
        
        // Add visit reference to profile
        profile.visits.push(visit._id);
        visitsCreated++;
      }
      
      // Save the updated profile
      await profile.save();
    }
    
    console.log(`Migration completed successfully!`);
    console.log(`Created ${medicalHistoriesCreated} medical history records`);
    console.log(`Created ${visitsCreated} visit records`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    
  } catch (error) {
    console.error('Error during migration:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the migration
migrateData();
