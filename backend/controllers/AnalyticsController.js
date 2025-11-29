import DiagnosticAssessmentPlan from "../models/DiagnosticAssessmentPlan.js";
import Visit from "../models/Visit.js";
import Profile from "../models/Profile.js";
import axios from "axios";
import Appointment from "../models/Appointment.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
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
    // 1. Aggregate by Barangay, City, and Province
    const locationCounts = await Profile.aggregate([
      {
        $match: {
          barangay: { $ne: null, $ne: "" },
          city: { $ne: null, $ne: "" },
        },
      },
      {
        $group: {
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

    const geocodedLocations = [];

    // 2. Loop sequentially instead of Promise.all to respect API Rate Limits
    for (const item of locationCounts) {
      const { barangay, city, province } = item._id;

      // Create cache key
      const cacheKey = `${barangay}, ${city}, ${province || ""}`.toLowerCase();
      const displayLabel = `${barangay}, ${city}`;

      // Check Cache First
      if (geoCache.has(cacheKey)) {
        geocodedLocations.push({
          city: displayLabel,
          fullAddress: cacheKey,
          patients: item.patientCount,
          ...geoCache.get(cacheKey),
        });
        continue; // Skip the API call if cached
      }

      try {
        // Construct Query
        const query = `${barangay}, ${city}, ${province || ""}, Philippines`;

        // 3. ADD DELAY: Wait 1 second before hitting the API
        await sleep(1000);

        const geoResponse = await axios.get(
          `https://nominatim.openstreetmap.org/search`,
          {
            params: {
              q: query,
              format: "json",
              addressdetails: 1,
              limit: 1,
            },
            headers: {
              // Nominatim requires a valid User-Agent identifying your app
              "User-Agent": "CECC-Clinic-App/1.0 (contact@example.com)",
            },
          }
        );

        if (geoResponse.data && geoResponse.data.length > 0) {
          const { lat, lon } = geoResponse.data[0];
          const coordinates = { lat: parseFloat(lat), lng: parseFloat(lon) };

          geoCache.set(cacheKey, coordinates); // Save to cache

          geocodedLocations.push({
            city: displayLabel,
            fullAddress: cacheKey,
            patients: item.patientCount,
            ...coordinates,
          });
        } else {
          // Fallback: If specific barangay fails, try finding just the City
          // This ensures the patient is at least mapped to the correct city
          console.log(
            `Detailed search failed for ${cacheKey}, trying City only...`
          );

          await sleep(1000); // Wait another second for the fallback request

          const cityQuery = `${city}, ${province || ""}, Philippines`;
          const cityResponse = await axios.get(
            `https://nominatim.openstreetmap.org/search`,
            {
              params: { q: cityQuery, format: "json", limit: 1 },
              headers: { "User-Agent": "CECC-Clinic-App/1.0" },
            }
          );

          if (cityResponse.data && cityResponse.data.length > 0) {
            const { lat, lon } = cityResponse.data[0];
            const coordinates = { lat: parseFloat(lat), lng: parseFloat(lon) };

            // Note: We don't cache this as the specific key because it's not exact,
            // but we display it.
            geocodedLocations.push({
              city: displayLabel,
              fullAddress: cacheKey,
              patients: item.patientCount,
              ...coordinates,
            });
          } else {
            // Totally failed
            geocodedLocations.push({
              city: displayLabel,
              patients: item.patientCount,
              lat: null,
              lng: null,
            });
          }
        }
      } catch (geoError) {
        console.error(`Geocoding failed for: ${cacheKey}`, geoError.message);
        // Push with null so we don't crash frontend calculations
        geocodedLocations.push({
          city: displayLabel,
          patients: item.patientCount,
          lat: null,
          lng: null,
        });
      }
    }

    // 4. Filter and Calculate Percentages
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
