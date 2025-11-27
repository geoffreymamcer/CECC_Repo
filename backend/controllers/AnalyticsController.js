import DiagnosticAssessmentPlan from "../models/DiagnosticAssessmentPlan.js";
import Visit from "../models/Visit.js";
import Profile from "../models/Profile.js";
import axios from "axios";
import Appointment from "../models/Appointment.js";

const geoCache = new Map();

export const getEyeConditionDistribution = async (req, res) => {
  try {
    const conditionData = await DiagnosticAssessmentPlan.aggregate([
      {
        $match: {
          "assessment.primaryImpression": { $ne: null, $ne: "" },
        },
      },

      {
        $group: {
          _id: "$assessment.primaryImpression",
          count: { $sum: 1 },
        },
      },

      {
        $project: {
          _id: 0,
          name: "$_id",
          value: "$count",
        },
      },

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
        dateGroupFormat = "%Y-%m";
        break;

      case "week":
        startDate = new Date();
        startDate.setDate(now.getDate() - 6 * 7);
        dateGroupFormat = "%Y-%U";
        break;

      default:
        startDate = new Date();
        startDate.setDate(now.getDate() - 6);
        dateGroupFormat = "%Y-%m-%d";
        break;
    }

    const visitData = await Visit.aggregate([
      {
        $match: {
          visitDate: { $gte: startDate },
        },
      },
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
      { $sort: { _id: 1 } },
    ]);

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
      {
        $match: {
          ageCategory: { $ne: null, $ne: "" },
        },
      },

      {
        $group: {
          _id: "$ageCategory",
          patientCount: { $sum: 1 },
        },
      },

      {
        $project: {
          _id: 0,
          age: "$_id",
          patients: "$patientCount",
        },
      },

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
    // 2️⃣ 🚀 NEW: Aggregate by Barangay, City, and Province for accuracy
    const locationCounts = await Profile.aggregate([
      {
        $match: {
          barangay: { $ne: null, $ne: "" }, // Ensure we have specific barangay data
          city: { $ne: null, $ne: "" }, // City is needed for context
        },
      },
      {
        $group: {
          // Group by unique combination of Barangay + City + Province
          _id: {
            barangay: "$barangay",
            city: "$city",
            province: "$province",
          },
          patientCount: { $sum: 1 },
        },
      },
      { $sort: { patientCount: -1 } },
    ]);

    const geocodedLocations = await Promise.all(
      locationCounts.map(async (item) => {
        const { barangay, city, province } = item._id;

        // 3️⃣ 🚀 NEW: Create a unique cache key to distinguish same-named barangays in different cities
        const cacheKey = `${barangay}, ${city}, ${
          province || ""
        }`.toLowerCase();

        // Format label for Frontend (e.g., "Brgy. Poblacion, Makati")
        const displayLabel = `${barangay}, ${city}`;

        if (geoCache.has(cacheKey)) {
          return {
            city: displayLabel, // Keep property name 'city' to avoid breaking frontend
            fullAddress: cacheKey,
            patients: item.patientCount,
            ...geoCache.get(cacheKey),
          };
        }

        try {
          // 4️⃣ 🛠️ MODIFIED: More specific Nominatim query for Barangay level
          // We build a query string: "Barangay Name, City Name, Province Name, Philippines"
          const query = `${barangay}, ${city}, ${province || ""}, Philippines`;

          const geoResponse = await axios.get(
            `https://nominatim.openstreetmap.org/search`,
            {
              params: {
                q: query,
                format: "json",
                addressdetails: 1,
                limit: 1,
              },
              headers: { "User-Agent": "CECC-Clinic-App/1.0" },
            }
          );

          if (geoResponse.data && geoResponse.data.length > 0) {
            const { lat, lon } = geoResponse.data[0];
            const coordinates = { lat: parseFloat(lat), lng: parseFloat(lon) };

            geoCache.set(cacheKey, coordinates); // Cache the result

            return {
              city: displayLabel, // Returning "Barangay, City" as the label
              fullAddress: cacheKey,
              patients: item.patientCount,
              ...coordinates,
            };
          }
        } catch (geoError) {
          console.error(`Geocoding failed for: ${cacheKey}`, geoError.message);
        }

        // Return with null coordinates if not found
        return {
          city: displayLabel,
          patients: item.patientCount,
          lat: null,
          lng: null,
        };
      })
    );

    // 5️⃣ 🛠️ MODIFIED: Filter invalid locations and calculate percentages
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

    const [totalPatients, monthlyVisits, newPatients, returningPatientsData] =
      await Promise.all([
        Profile.countDocuments(),

        Appointment.countDocuments({
          appointmentDate: { $gte: thirtyDaysAgo },
          status: "completed",
        }),

        Profile.countDocuments({
          createdAt: { $gte: thirtyDaysAgo },
        }),

        Visit.aggregate([
          { $group: { _id: "$patientId", visitCount: { $sum: 1 } } },
          { $match: { visitCount: { $gt: 1 } } },
          { $count: "returningCount" },
        ]),
      ]);

    const returningPatientCount = returningPatientsData[0]?.returningCount || 0;

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
