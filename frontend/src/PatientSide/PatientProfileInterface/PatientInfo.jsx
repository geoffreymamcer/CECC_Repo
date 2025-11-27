import React, { useState, useMemo } from "react";
import "./PatientProfileInterface.css";
import ChangePasswordModal from "./ChangePasswordModal ";
import instance from "../../api/axios";
import regionsRaw from "../../services/phAddress/region.json";
import provincesRaw from "../../services/phAddress/province.json";
import citiesRaw from "../../services/phAddress/city.json";
import barangaysRaw from "../../services/phAddress/barangay.json";

const regions = Array.isArray(regionsRaw)
  ? regionsRaw
  : regionsRaw.default || [];
const provinces = Array.isArray(provincesRaw)
  ? provincesRaw
  : provincesRaw.default || [];
const cities = Array.isArray(citiesRaw) ? citiesRaw : citiesRaw.default || [];
const barangays = Array.isArray(barangaysRaw)
  ? barangaysRaw
  : barangaysRaw.default || [];

// Helper functions kept exactly as required
const calculateAge = (dob) => {
  if (!dob) return "";
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const getAgeCategory = (age) => {
  if (age >= 0 && age <= 12) return "Child: 0-12";
  if (age >= 13 && age <= 19) return "Teen: 13-19";
  if (age >= 20 && age <= 39) return "Adult: 20-39";
  if (age >= 40 && age <= 59) return "Middle Age: 40-59";
  if (age >= 60) return "Senior: 60 & up";
  return "";
};

const PatientInfo = ({ profileData, onProfileUpdate }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [patientData, setPatientData] = useState(profileData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({ ...patientData });

  const [addressCodes, setAddressCodes] = useState({
    region: "",
    province: "",
    city: "",
    barangay: "",
  });

  const filteredProvinces = useMemo(() => {
    if (!addressCodes.region) return [];
    return provinces.filter((p) => p.region_code === addressCodes.region);
  }, [addressCodes.region]);

  const filteredCities = useMemo(() => {
    if (!addressCodes.province) return [];
    return cities.filter((c) => c.province_code === addressCodes.province);
  }, [addressCodes.province]);

  const filteredBarangays = useMemo(() => {
    if (!addressCodes.city) return [];
    return barangays.filter((b) => b.city_code === addressCodes.city);
  }, [addressCodes.city]);

  const handleEditClick = async () => {
    if (isEditing) {
      await handleSaveProfile();
    } else {
      const foundRegion = regions.find(
        (r) => r.region_name === patientData.region
      );
      const regionCode = foundRegion ? foundRegion.region_code : "";

      const foundProvince = provinces.find(
        (p) =>
          p.province_name === patientData.province &&
          p.region_code === regionCode
      );
      const provinceCode = foundProvince ? foundProvince.province_code : "";

      const foundCity = cities.find(
        (c) =>
          c.city_name === patientData.city && c.province_code === provinceCode
      );
      const cityCode = foundCity ? foundCity.city_code : "";

      const foundBarangay = barangays.find(
        (b) => b.brgy_name === patientData.barangay && b.city_code === cityCode
      );
      const barangayCode = foundBarangay ? foundBarangay.brgy_code : "";

      setAddressCodes({
        region: regionCode,
        province: provinceCode,
        city: cityCode,
        barangay: barangayCode,
      });

      setTempData({ ...patientData });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData({ ...patientData }); // Revert changes
    setSaveError(null);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const patientId = patientData.patientId;
      if (!patientId)
        throw new Error("Cannot update profile: Patient ID is missing.");

      const age = calculateAge(tempData.dob);
      const ageCategory = getAgeCategory(age);

      const rName =
        regions.find((r) => r.region_code === addressCodes.region)
          ?.region_name || "";
      const pName =
        provinces.find((p) => p.province_code === addressCodes.province)
          ?.province_name || "";
      const cName =
        cities.find((c) => c.city_code === addressCodes.city)?.city_name || "";
      const bName =
        barangays.find((b) => b.brgy_code === addressCodes.barangay)
          ?.brgy_name || "";
      const street = tempData.street_subdivision || "";

      const combinedAddress = [street, bName, cName, pName, rName]
        .filter((part) => part && part.trim() !== "")
        .join(", ");

      const updatedProfile = {
        firstName: tempData.firstName,
        middleName: tempData.middleName,
        lastName: tempData.lastName,
        phone_number: tempData.phone,
        email: tempData.email,
        dob: tempData.dob,
        age: age,
        ageCategory: ageCategory,
        gender: tempData.gender,
        civilStatus: tempData.civiStatus,
        occupation: tempData.occupation,
        street_subdivision: street,
        region: rName,
        province: pName,
        city: cName,
        barangay: bName,
        address: combinedAddress,
        addressCombined: combinedAddress,
      };

      const response = await instance.put(
        `/profiles/${patientId}`,
        updatedProfile
      );
      onProfileUpdate(response.data);
      setPatientData(response.data); // Update local state
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setSaveError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    const newData = { ...tempData, [field]: value };
    if (field === "dob") {
      const age = calculateAge(value);
      newData.age = age;
      newData.ageCategory = getAgeCategory(age);
    }
    setTempData(newData);
  };

  const handleAddressCodeChange = (field, value) => {
    setAddressCodes((prev) => {
      const newCodes = { ...prev, [field]: value };

      if (field === "region") {
        newCodes.province = "";
        newCodes.city = "";
        newCodes.barangay = "";
      } else if (field === "province") {
        newCodes.city = "";
        newCodes.barangay = "";
      } else if (field === "city") {
        newCodes.barangay = "";
      }
      return newCodes;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    window.location.href = "/";
  };

  // 👇 🤖 EMOJI: New Render Field Function for Grid Layout & Modern Input Styling
  const renderField = (
    label,
    field,
    type = "text",
    fullWidth = false,
    readOnly = false
  ) => {
    // 7️⃣ 🔢 EMOJI: Special rendering for Address Field
    if (field === "address" && isEditing) {
      return (
        <div
          className={`flex flex-col ${
            fullWidth ? "col-span-full" : "col-span-1"
          }`}
        >
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
            Physical Address
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            {/* Region */}
            <select
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7F0000]/20"
              value={addressCodes.region}
              onChange={(e) =>
                handleAddressCodeChange("region", e.target.value)
              }
            >
              <option value="">Select Region</option>
              {regions.map((r) => (
                <option key={r.region_code} value={r.region_code}>
                  {r.region_name}
                </option>
              ))}
            </select>

            {/* Province */}
            <select
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7F0000]/20 disabled:bg-gray-100 disabled:text-gray-400"
              value={addressCodes.province}
              onChange={(e) =>
                handleAddressCodeChange("province", e.target.value)
              }
              disabled={!addressCodes.region}
            >
              <option value="">Select Province</option>
              {filteredProvinces.map((p) => (
                <option key={p.province_code} value={p.province_code}>
                  {p.province_name}
                </option>
              ))}
            </select>

            {/* City */}
            <select
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7F0000]/20 disabled:bg-gray-100 disabled:text-gray-400"
              value={addressCodes.city}
              onChange={(e) => handleAddressCodeChange("city", e.target.value)}
              disabled={!addressCodes.province}
            >
              <option value="">Select City/Municipality</option>
              {filteredCities.map((c) => (
                <option key={c.city_code} value={c.city_code}>
                  {c.city_name}
                </option>
              ))}
            </select>

            {/* Barangay */}
            <select
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7F0000]/20 disabled:bg-gray-100 disabled:text-gray-400"
              value={addressCodes.barangay}
              onChange={(e) =>
                handleAddressCodeChange("barangay", e.target.value)
              }
              disabled={!addressCodes.city}
            >
              <option value="">Select Barangay</option>
              {filteredBarangays.map((b) => (
                <option key={b.brgy_code} value={b.brgy_code}>
                  {b.brgy_name}
                </option>
              ))}
            </select>

            {/* Street / Subdivision */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="House No., Street, Subdivision (Optional)"
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7F0000]/20"
                value={tempData.street_subdivision || ""}
                onChange={(e) =>
                  handleInputChange("street_subdivision", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      );
    }
    // 7️⃣ END

    const value = isEditing ? tempData[field] || "" : profileData[field] || "";
    const displayValue =
      !value && !isEditing ? (
        <span className="text-gray-400 italic">Not set</span>
      ) : (
        value
      );

    return (
      <div
        className={`flex flex-col ${
          fullWidth ? "col-span-full" : "col-span-1"
        }`}
      >
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
          {label}
        </label>

        {isEditing && !readOnly ? (
          type === "textarea" ? (
            <textarea
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7F0000]/20 focus:border-[#7F0000] transition-all"
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              rows={3}
            />
          ) : type === "select" ? (
            <select
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7F0000]/20 focus:border-[#7F0000] transition-all"
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
            >
              <option value="">Select...</option>
              {/* Specific options based on field */}
              {field === "gender" &&
                ["Male", "Female", "Other"].map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              {field === "civiStatus" &&
                ["Single", "Married", "Widowed", "Separated"].map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
            </select>
          ) : (
            <input
              type={type}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7F0000]/20 focus:border-[#7F0000] transition-all"
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
            />
          )
        ) : (
          <div className="p-3 bg-white border border-transparent rounded-xl text-gray-800 font-medium truncate">
            {displayValue}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {profileData.firstName} {profileData.lastName}
          </h2>
          <p className="text-gray-500">
            Patient ID:{" "}
            <span className="font-mono text-gray-400">
              {profileData.patientId}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:bg-[#7F0000] transition-all flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {saveError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {saveError}
        </div>
      )}

      {/* Forms Grid Container */}
      <div className="space-y-8 animate-fadeIn">
        {/* SECTION 1: Identity */}
        <section>
          <h3 className="text-lg font-bold text-[#7F0000] mb-4 flex items-center gap-2">
            <span className="bg-red-50 p-1.5 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
            </span>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderField("First Name", "firstName")}
            {renderField("Middle Name", "middleName")}
            {renderField("Last Name", "lastName")}
            {renderField("Date of Birth", "dob", "date")}
            {/* Calculated Fields - Read Only */}
            {renderField("Age", "age", "text", false, true)}
            {renderField("Category", "ageCategory", "text", false, true)}
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* SECTION 2: Contact */}
        <section>
          <h3 className="text-lg font-bold text-[#7F0000] mb-4 flex items-center gap-2">
            <span className="bg-red-50 p-1.5 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </span>
            Contact Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField("Email Address", "email", "email")}
            {renderField("Phone Number", "phone", "tel")}
            {renderField("Home Address", "address", "textarea", true)}
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* SECTION 3: Demographics */}
        <section>
          <h3 className="text-lg font-bold text-[#7F0000] mb-4 flex items-center gap-2">
            <span className="bg-red-50 p-1.5 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </span>
            Demographics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderField("Gender", "gender", "select")}
            {renderField("Civil Status", "civiStatus", "select")}
            {renderField("Occupation", "occupation")}
          </div>
        </section>

        {/* EDIT ACTIONS TOOLBAR (Sticky at bottom on mobile, inline on desktop) */}
        {isEditing && (
          <div className="sticky bottom-4 z-10 mt-8">
            <div className="bg-gray-900/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center animate-slideUp">
              <span className="text-sm font-medium pl-2">Unsaved changes</span>
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 rounded-xl text-sm font-bold text-gray-300 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl text-sm font-bold bg-[#7F0000] hover:bg-red-700 transition-colors shadow-lg flex items-center gap-2"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="pt-8 mt-8 border-t border-gray-100 flex flex-wrap gap-4 justify-end">
          <button
            className="text-sm font-semibold text-gray-500 hover:text-[#7F0000] flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            onClick={() => setShowChangePassword(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            Change Password
          </button>
          <button
            className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={handleLogout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Log Out
          </button>
        </div>
      </div>

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  );
};

export default PatientInfo;
