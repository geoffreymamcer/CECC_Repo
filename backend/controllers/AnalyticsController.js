import DiagnosticAssessmentPlan from "../models/DiagnosticAssessmentPlan.js";
import Visit from "../models/Visit.js";
import Profile from "../models/Profile.js";
import axios from "axios";
import Appointment from "../models/Appointment.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const geoCache = new Map();
const cleanString = (str) => {
  if (!str) return "";
  return str.replace(/\(.*\)/g, "").trim();
};

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

    // Use a loop for sequential processing to respect API limits
    for (const item of locationCounts) {
      const rawBarangay = item._id.barangay;
      const rawCity = item._id.city;
      const rawProvince = item._id.province;

      // Clean the names for the search query (e.g., "Lucena City (Capital)" -> "Lucena City")
      const barangay = cleanString(rawBarangay);
      const city = cleanString(rawCity);
      const province = cleanString(rawProvince);

      const cacheKey = `${barangay}, ${city}, ${province}`.toLowerCase();
      const displayLabel = `${rawBarangay}, ${rawCity}`; // Keep original for display

      // 1. Check Cache
      if (geoCache.has(cacheKey)) {
        geocodedLocations.push({
          city: displayLabel,
          fullAddress: cacheKey,
          patients: item.patientCount,
          ...geoCache.get(cacheKey),
        });
        continue;
      }

      try {
        // 2. Add Delay (1 second)
        await sleep(1000);

        // 3. Construct Query
        // We try to be specific: "Barangay, City, Province, Philippines"
        const query = `${barangay}, ${city}, ${province}, Philippines`;

        let coordinates = null;
        let found = false;

        // --- ATTEMPT 1: Full Specific Search ---
        const geoResponse = await axios.get(
          `https://nominatim.openstreetmap.org/search`,
          {
            params: {
              q: query,
              format: "json",
              addressdetails: 1, // Important: Allows us to verify the address
              limit: 1,
            },
            headers: { "User-Agent": "CECC-Clinic-App/1.0" },
          }
        );

        if (geoResponse.data && geoResponse.data.length > 0) {
          const result = geoResponse.data[0];
          const address = result.address || {};

          // VERIFICATION: Check if the result is actually in the City or Province we asked for.
          // This prevents "Lucena Street, Manila" from being accepted when we wanted "Lucena City".
          const resultCity = (
            address.city ||
            address.town ||
            address.municipality ||
            ""
          ).toLowerCase();
          const resultState = (
            address.state ||
            address.region ||
            ""
          ).toLowerCase();
          const targetCity = city.toLowerCase();

          // We check if the returned city includes our target (or vice versa)
          const isCityMatch =
            resultCity.includes(targetCity) || targetCity.includes(resultCity);

          if (isCityMatch) {
            coordinates = {
              lat: parseFloat(result.lat),
              lng: parseFloat(result.lon),
            };
            found = true;
          } else {
            console.log(
              `Mismatch detected: Requested "${city}" but got "${resultCity}". Retrying with fallback...`
            );
          }
        }

        // --- ATTEMPT 2: Fallback (City Only) ---
        // If specific barangay failed or returned the wrong city (Manila instead of Lucena), try just the City.
        if (!found) {
          await sleep(1000); // Delay again

          // Structured query is safer for City-level searches
          const cityQuery = `${city}, ${province}, Philippines`;

          const cityResponse = await axios.get(
            `https://nominatim.openstreetmap.org/search`,
            {
              params: {
                q: cityQuery,
                format: "json",
                limit: 1,
              },
              headers: { "User-Agent": "CECC-Clinic-App/1.0" },
            }
          );

          if (cityResponse.data && cityResponse.data.length > 0) {
            const result = cityResponse.data[0];
            coordinates = {
              lat: parseFloat(result.lat),
              lng: parseFloat(result.lon),
            };
            found = true;
            // Note: We are mapping it to the City center because the specific Barangay wasn't found/verified.
          }
        }

        if (found && coordinates) {
          geoCache.set(cacheKey, coordinates);
          geocodedLocations.push({
            city: displayLabel,
            fullAddress: cacheKey,
            patients: item.patientCount,
            ...coordinates,
          });
        } else {
          // Final Fallback: Return null coordinates so it doesn't break the UI
          geocodedLocations.push({
            city: displayLabel,
            patients: item.patientCount,
            lat: null,
            lng: null,
          });
        }
      } catch (geoError) {
        console.error(`Geocoding error for: ${cacheKey}`, geoError.message);
        geocodedLocations.push({
          city: displayLabel,
          patients: item.patientCount,
          lat: null,
          lng: null,
        });
      }
    }

    // Filter valid locations and calculate percentages
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
export const getClinicalCorrelation = async (req, res) => {
  try {
    // 1. Get all Diagnostic Plans with a valid primary impression
    const diagnoses = await DiagnosticAssessmentPlan.find({
      "assessment.primaryImpression": { $ne: null, $ne: "" },
    }).select("patientId assessment.primaryImpression");

    // 2. Extract unique patient IDs to fetch profiles
    const patientIds = [...new Set(diagnoses.map((d) => d.patientId))];

    // 3. Fetch Profiles for these patients to get their Age Group
    const profiles = await Profile.find({
      patientId: { $in: patientIds },
    }).select("patientId ageCategory");

    // Helper to normalize Age Groups
    const normalizeAgeGroup = (age) => {
      if (!age) return "Unknown";
      const normalized = age.toLowerCase();
      if (normalized.includes("child")) return "Child";
      if (normalized.includes("teen")) return "Teen";
      if (normalized.includes("young adult")) return "Young Adult";
      if (normalized.includes("middle") || normalized.includes("adult"))
        return "Adult";
      if (normalized.includes("senior") || normalized.includes("elder"))
        return "Senior";
      return "Unknown";
    };

    // Map patientId -> ageCategory (Normalized)
    const patientAgeMap = {};
    profiles.forEach((p) => {
      patientAgeMap[p.patientId] = normalizeAgeGroup(p.ageCategory);
    });

    // 4. Build the Correlation Matrix
    // Structure: { "Myopia": { "Child": 5, "Adult": 2 }, "Glaucoma": { ... } }
    const correlationMatrix = {};

    diagnoses.forEach((d) => {
      const condition = d.assessment.primaryImpression;
      const ageGroup = patientAgeMap[d.patientId] || "Unknown";

      if (!correlationMatrix[condition]) {
        correlationMatrix[condition] = {};
      }
      if (!correlationMatrix[condition][ageGroup]) {
        correlationMatrix[condition][ageGroup] = 0;
      }
      correlationMatrix[condition][ageGroup]++;
    });

    // 5. Format for Frontend Grid
    // We want a consistent list of X-Axis (Age Groups) and Y-Axis (Conditions)
    const allAgeGroups = [
      "Child",
      "Teen",
      "Young Adult",
      "Adult",
      "Senior",
      "Unknown",
    ];

    // Get top 10 conditions to keep the chart readable
    const topConditions = Object.keys(correlationMatrix)
      .sort((a, b) => {
        const totalA = Object.values(correlationMatrix[a]).reduce(
          (sum, v) => sum + v,
          0
        );
        const totalB = Object.values(correlationMatrix[b]).reduce(
          (sum, v) => sum + v,
          0
        );
        return totalB - totalA;
      })
      .slice(0, 10);

    const heatmapData = topConditions.map((condition) => {
      const row = { condition };
      allAgeGroups.forEach((age) => {
        row[age] = correlationMatrix[condition][age] || 0;
      });
      return row;
    });

    res.status(200).json(heatmapData);
  } catch (error) {
    console.error("Error fetching clinical correlation:", error);
    res.status(500).json({ message: "Error fetching clinical correlation" });
  }
};

export const getPeakHours = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      status: { $ne: "cancelled" },
    }).select("appointmentDate appointmentTime");

    // Grid: 7 Days x Hours (e.g. 8AM to 5PM)
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    // Define operational hours range for the grid (e.g., 08:00 to 17:00)
    // We will parse the time string "HH:MM AM/PM"
    const grid = {};

    appointments.forEach((appt) => {
      const date = new Date(appt.appointmentDate);
      const dayName = daysOfWeek[date.getDay()];

      // Normalize time to Hour (24h format)
      // Expecting format like "10:00 AM"
      const timeParts = appt.appointmentTime.split(/[:\s]+/); // ["10", "00", "AM"]
      let hour = parseInt(timeParts[0]);
      const meridian = timeParts[2]; // "AM" or "PM"

      if (meridian === "PM" && hour !== 12) hour += 12;
      if (meridian === "AM" && hour === 12) hour = 0;

      const hourLabel = `${hour}:00`; // Simplify to hour buckets

      if (!grid[dayName]) grid[dayName] = {};
      if (!grid[dayName][hourLabel]) grid[dayName][hourLabel] = 0;

      grid[dayName][hourLabel]++;
    });

    res.status(200).json(grid);
  } catch (error) {
    console.error("Error fetching peak hours:", error);
    res.status(500).json({ message: "Error fetching peak hours" });
  }
};

export const getServiceDistribution = async (req, res) => {
  try {
    const serviceData = await Appointment.aggregate([
      {
        $match: { status: { $ne: "cancelled" } },
      },
      {
        $group: {
          _id: "$serviceType",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const formattedData = serviceData.map((item) => ({
      name: item._id,
      value: item.count,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching service distribution:", error);
    res.status(500).json({ message: "Error fetching service distribution" });
  }
};
