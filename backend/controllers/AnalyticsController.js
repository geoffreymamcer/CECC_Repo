import DiagnosticAssessmentPlan from "../models/DiagnosticAssessmentPlan.js";
import Visit from "../models/Visit.js";
import Profile from "../models/Profile.js";
import axios from "axios";
import Appointment from "../models/Appointment.js";

const geoCache = new Map();

// --- NEW --- Analytics function for Eye Condition Distribution
export const getEyeConditionDistribution = async (req, res) => {
  try {
    const conditionData = await DiagnosticAssessmentPlan.aggregate([
      // Stage 1: Filter out documents where primaryImpression is empty or null
      {
        $match: {
          "assessment.primaryImpression": { $ne: null, $ne: "" },
        },
      },

      // Stage 2: Group by the primaryImpression field and count occurrences
      {
        $group: {
          _id: "$assessment.primaryImpression",
          count: { $sum: 1 },
        },
      },

      // Stage 3: Format the output to match the frontend's expectation
      {
        $project: {
          _id: 0,
          name: "$_id", // Rename _id to 'name'
          value: "$count", // Rename count to 'value'
        },
      },

      // Stage 4: Sort by the highest count first
      {
        $sort: { value: -1 },
      },
    ]);

    res.status(200).json(conditionData);
  } catch (error) {
    console.error("Error fetching eye condition distribution:", error);
    res.status(500).json({ message: "Error fetching eye condition data" });
  }
};
export const getVisitGrowth = async (req, res) => {
  try {
    const { timeFrame = "day" } = req.query;
    const timezone = req.header("X-User-Timezone") || "Asia/Manila";

    let startDate;
    let dateGroupFormat;
    const now = new Date();

    switch (timeFrame) {
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        dateGroupFormat = "%Y-%m"; // Group by year-month (e.g., "2025-10")
        break;

      case "week":
        startDate = new Date();
        startDate.setDate(now.getDate() - 6 * 7);
        dateGroupFormat = "%Y-%U"; // Group by year-week number (e.g., "2025-43")
        break;

      default: // 'day'
        startDate = new Date();
        startDate.setDate(now.getDate() - 6);
        dateGroupFormat = "%Y-%m-%d"; // Group by year-month-day (e.g., "2025-10-31")
        break;
    }

    const visitData = await Visit.aggregate([
      // 1. Filter visits to be within our desired date range
      {
        $match: {
          visitDate: { $gte: startDate },
        },
      },
      // 2. Group by the calculated date format and count the number of visits
      {
        $group: {
          _id: {
            $dateToString: {
              format: dateGroupFormat,
              date: "$visitDate",
              timezone: timezone,
            },
          },
          visitCount: { $sum: 1 },
        },
      },
      // 3. Sort by the date group
      { $sort: { _id: 1 } },
    ]);

    // 4. Convert the result array into a key-value map for easy lookup
    const visitMap = visitData.reduce((acc, item) => {
      acc[item._id] = item.visitCount;
      return acc;
    }, {});

    res.status(200).json(visitMap);
  } catch (error) {
    console.error("Error fetching visit growth data:", error);
    res.status(500).json({ message: "Error fetching visit growth data" });
  }
};

export const getAgeGroupDistribution = async (req, res) => {
  try {
    const ageGroupData = await Profile.aggregate([
      // Stage 1: Filter out any profiles that might be missing an age category
      {
        $match: {
          ageCategory: { $ne: null, $ne: "" },
        },
      },

      // Stage 2: Group by the 'ageCategory' field and count the number of patients in each group
      {
        $group: {
          _id: "$ageCategory",
          patientCount: { $sum: 1 },
        },
      },

      // Stage 3: Format the output to match the frontend's expectation
      {
        $project: {
          _id: 0,
          age: "$_id", // Rename _id to 'age'
          patients: "$patientCount", // Rename patientCount to 'patients'
        },
      },

      // Stage 4: Sort by the age group name for a consistent order in the chart
      {
        $sort: { age: 1 },
      },
    ]);

    res.status(200).json(ageGroupData);
  } catch (error) {
    console.error("Error fetching age group distribution:", error);
    res.status(500).json({ message: "Error fetching age group data" });
  }
};

export const getGeographicDistribution = async (req, res) => {
  try {
    const cityCounts = await Profile.aggregate([
      { $match: { city: { $ne: null, $ne: "" } } },
      { $group: { _id: "$city", patientCount: { $sum: 1 } } },
      { $sort: { patientCount: -1 } },
    ]);

    const geocodedLocations = await Promise.all(
      cityCounts.map(async (item) => {
        const city = item._id;
        if (geoCache.has(city)) {
          // Return from cache if available
          return { city, patients: item.patientCount, ...geoCache.get(city) };
        }

        try {
          // Geocoding API call (Nominatim is free but has usage limits)
          const geoResponse = await axios.get(
            `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
              city
            )}&country=Philippines&format=json`,
            { headers: { "User-Agent": "CECC-Clinic-App/1.0" } } // Important for Nominatim policy
          );

          if (geoResponse.data && geoResponse.data.length > 0) {
            const { lat, lon } = geoResponse.data[0];
            const coordinates = { lat: parseFloat(lat), lng: parseFloat(lon) };
            geoCache.set(city, coordinates); // Store in cache
            return { city, patients: item.patientCount, ...coordinates };
          }
        } catch (geoError) {
          console.error(`Geocoding failed for city: ${city}`, geoError.message);
        }

        return { city, patients: item.patientCount, lat: null, lng: null };
      })
    );

    // Filter out locations that could not be geocoded
    const validLocations = geocodedLocations.filter(
      (loc) => loc.lat && loc.lng
    );

    const totalPatients = validLocations.reduce(
      (sum, item) => sum + item.patients,
      0
    );

    const resultsWithPercentage = validLocations.map((item) => ({
      ...item,
      percentage:
        totalPatients > 0
          ? parseFloat(((item.patients / totalPatients) * 100).toFixed(1))
          : 0,
    }));

    res.status(200).json(resultsWithPercentage);
  } catch (error) {
    console.error("Error fetching geographic distribution:", error);
    res.status(500).json({ message: "Error fetching geographic data" });
  }
};

export const getSummaryCardStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // We will run all our database queries in parallel for maximum efficiency
    const [totalPatients, monthlyVisits, newPatients, returningPatientsData] =
      await Promise.all([
        // 1. Get total number of patients
        Profile.countDocuments(),

        // 2. Get number of completed appointments in the last 30 days
        Appointment.countDocuments({
          appointmentDate: { $gte: thirtyDaysAgo },
          status: "completed",
        }),

        // 3. Get number of new patients in the last 30 days
        Profile.countDocuments({
          createdAt: { $gte: thirtyDaysAgo },
        }),

        // 4. Get the number of patients with more than one visit (returning patients)
        Visit.aggregate([
          { $group: { _id: "$patientId", visitCount: { $sum: 1 } } },
          { $match: { visitCount: { $gt: 1 } } },
          { $count: "returningCount" },
        ]),
      ]);

    const returningPatientCount = returningPatientsData[0]?.returningCount || 0;

    // Calculate retention rate, avoiding division by zero
    const retentionRate =
      totalPatients > 0
        ? parseFloat(((returningPatientCount / totalPatients) * 100).toFixed(1))
        : 0;

    res.status(200).json({
      totalPatients,
      monthlyVisits,
      retentionRate,
      newPatients,
    });
  } catch (error) {
    console.error("Error fetching summary card stats:", error);
    res.status(500).json({ message: "Error fetching summary stats" });
  }
};

/* --- OLD FUNCTION USING APPOINTMENTS ---
export const getVisitGrowth = async (req, res) => {
  try {
    const { timeFrame = 'day' } = req.query;
    const timezone = req.header('X-User-Timezone') || 'Asia/Manila';

    let startDate;
    let dateGroupFormat;
    const now = new Date();

    switch (timeFrame) {
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        dateGroupFormat = "%Y-%m";
        break;
      
      case 'week':
        startDate = new Date();
        startDate.setDate(now.getDate() - 6 * 7);
        dateGroupFormat = "%Y-%U";
        break;

      default: // 'day'
        startDate = new Date();
        startDate.setDate(now.getDate() - 6);
        dateGroupFormat = "%Y-%m-%d";
        break;
    }

    const visitData = await Appointment.aggregate([ // --- MODIFIED --- Use Appointment model
      // 1. Filter appointments to be within our desired date range and that are 'completed'
      { 
        $match: { 
          appointmentDate: { $gte: startDate },
          status: "completed" // Optional: Only count completed visits for more accurate data
        } 
      },
      // 2. Group by the calculated date format and count the number of appointments
      {
        $group: {
          _id: { 
            $dateToString: { 
              format: dateGroupFormat, 
              date: "$appointmentDate", // --- MODIFIED --- Use appointmentDate
              timezone: timezone
            } 
          },
          visitCount: { $sum: 1 },
        },
      },
      // 3. Sort by the date group
      { $sort: { _id: 1 } },
    ]);

    // 4. Convert the result array into a key-value map
    const visitMap = visitData.reduce((acc, item) => {
        acc[item._id] = item.visitCount;
        return acc;
    }, {});

    res.status(200).json(visitMap);

  } catch (error) {
    console.error("Error fetching visit growth data:", error);
    res.status(500).json({ message: "Error fetching visit growth data" });
  }
};
*/
