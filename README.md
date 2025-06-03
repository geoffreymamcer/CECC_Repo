# CECC MERN Stack Application

A comprehensive MERN (MongoDB, Express, React, Node.js) stack application for managing patient data, appointments, and medical records for an eye care clinic.

## Features

- User authentication and authorization
- Patient profile management
- Medical history tracking
- Visit records
- Test results
- Appointment scheduling
- Admin dashboard
- Patient portal

## Project Structure

The application is divided into two main parts:

- **Backend**: Express.js API with MongoDB
- **Frontend**: React.js application with separate admin and patient sides

## Data Models

The application uses the following main data models:

1. **User**: Authentication and user information
2. **Profile**: Patient profile information
3. **MedicalHistory**: Patient medical history (separate from profile)
4. **Visit**: Patient visit records
5. **TestResult**: Results from various eye tests
6. **Appointment**: Appointment scheduling information

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user

### Profile Management
- `GET /api/profile/:id` - Get profile by ID
- `GET /api/profile/patient/:patientId` - Get profile by patient ID
- `POST /api/profile` - Create a new profile
- `PUT /api/profile/:id` - Update a profile
- `DELETE /api/profile/:id` - Delete a profile

### Medical History
- `GET /api/medicalhistory/:patientId` - Get medical history by patient ID
- `POST /api/medicalhistory` - Create a new medical history
- `PUT /api/medicalhistory/:id` - Update a medical history by ID
- `PUT /api/medicalhistory/patient/:patientId` - Update a medical history by patient ID (creates if not exists)
- `DELETE /api/medicalhistory/:id` - Delete a medical history

### Visit Records
- `GET /api/visits/patient/:patientId` - Get all visits for a patient
- `GET /api/visits/:id` - Get a single visit by ID
- `POST /api/visits` - Create a new visit
- `PUT /api/visits/:id` - Update a visit
- `DELETE /api/visits/:id` - Delete a visit

### Test Results
- `GET /api/testresults/patient/:patientId` - Get all test results for a patient
- `GET /api/testresults/patient/:patientId/type/:testType` - Get test results by type for a patient
- `GET /api/testresults/:id` - Get a single test result by ID
- `POST /api/testresults` - Create a new test result
- `PUT /api/testresults/:id` - Update a test result
- `DELETE /api/testresults/:id` - Delete a test result

## Setup and Installation

1. Clone the repository
2. Install dependencies for both backend and frontend:
   ```
   npm install
   cd frontend
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Run the migration script to move existing data to the new data models:
   ```
   npm run migrate
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## Data Migration

If you're upgrading from a previous version of the application, you'll need to run the data migration script to move data from the old structure to the new one:

```
npm run migrate
```

This script will:
1. Move medical history data from Profile documents to the MedicalHistory collection
2. Create Visit records from visit-related fields in Profile documents
3. Update references between documents to maintain data integrity

## Development

To run the application in development mode:

```
npm run dev
```

This will start both the backend server and the frontend development server concurrently.

## Production

To build the frontend for production:

```
cd frontend
npm run build
```

To start the production server:

```
npm start
```

## License

MIT
