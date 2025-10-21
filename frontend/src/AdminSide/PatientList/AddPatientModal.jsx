// src/components/AddPatientModal.jsx
import React, { useState, useMemo } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import axios from "axios";
import regions from "../../services/phAddress/region.json";
import provinces from "../../services/phAddress/province.json";
import cities from "../../services/phAddress/city.json";
import barangays from "../../services/phAddress/barangay.json";

const AddPatientModal = ({ handleCloseModal, handleAddPatient }) => {
  // --- State variables from floating-button.jsx ---
  const [patientId, setPatientId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  // structured address fields (region -> province -> city -> barangay + street)
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [contact, setContact] = useState("");
  const [occupation, setOccupation] = useState("");
  const [otherOccupation, setOtherOccupation] = useState(""); // State for "Other" occupation
  const [civilStatus, setCivilStatus] = useState("");
  const [referralBy, setReferralBy] = useState("");
  const [ageCategory, setAgeCategory] = useState("");
  // Medical History
  const [ocularHistory, setOcularHistory] = useState("");
  const [healthHistory, setHealthHistory] = useState("");
  const [familyMedicalHistory, setFamilyMedicalHistory] = useState("");
  const [medications, setMedications] = useState("");
  const [allergies, setAllergies] = useState("");
  const [occupationalHistoryMH, setOccupationalHistoryMH] = useState("");
  const [digitalHistory, setDigitalHistory] = useState("");
  // Visit Details
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [associatedComplaint, setAssociatedComplaint] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");

  // --- Start of added code ---
  const occupationOptions = [
    "Accountant",
    "Architect",
    "Artist",
    "Chef",
    "Developer",
    "Doctor",
    "Driver",
    "Engineer",
    "Farmer",
    "Government Employee",
    "Housewife",
    "Lawyer",
    "Nurse",
    "Police Officer",
    "Salesperson",
    "Student",
    "Teacher",
    "Unemployed",
    "Other",
  ];
  // --- End of added code ---

  // Helper functions from floating-button.jsx
  // derived lists for cascading selects
  const filteredProvinces = useMemo(() => {
    if (!selectedRegion) return [];
    return provinces.filter((p) => p.region_code === selectedRegion);
  }, [selectedRegion]);

  const filteredCities = useMemo(() => {
    if (!selectedProvince) return [];
    return cities.filter((c) => c.province_code === selectedProvince);
  }, [selectedProvince]);

  const filteredBarangays = useMemo(() => {
    if (!selectedCity) return [];
    return barangays.filter((b) => b.city_code === selectedCity);
  }, [selectedCity]);

  const getAgeCategory = (calculatedAge) => {
    if (calculatedAge >= 0 && calculatedAge <= 12) return "Child: 0-12";
    if (calculatedAge >= 13 && calculatedAge <= 19) return "Teen: 13-19";
    if (calculatedAge >= 20 && calculatedAge <= 39) return "Adult: 20-39";
    if (calculatedAge >= 40 && calculatedAge <= 59) return "Middle Age: 40-59";
    if (calculatedAge >= 60) return "Senior: 60 & up";
    return "";
  };

  const handleDobChange = (e) => {
    const selectedDob = e.target.value;
    setDob(selectedDob);
    if (selectedDob) {
      const birthDate = new Date(selectedDob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }
      setAge(calculatedAge.toString());
      setAgeCategory(getAgeCategory(calculatedAge));
    } else {
      setAge("");
      setAgeCategory("");
    }
  };

  const generateNextPatientId = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/profiles/latest-id"
      );
      const latestId = response.data.latestId || "CECC25B-0000";
      const numericPart = parseInt(latestId.split("-")[1]);
      const nextNumber = numericPart + 1;
      const paddedNumber = nextNumber.toString().padStart(4, "0");
      const newPatientId = `CECC25B-${paddedNumber}`;
      setPatientId(newPatientId);
      return newPatientId;
    } catch (error) {
      console.error("Error generating patient ID:", error);
      const timestamp = new Date().getTime();
      const fallbackId = `CECC25B-${timestamp}`;
      setPatientId(fallbackId);
      return fallbackId;
    }
  };

  React.useEffect(() => {
    generateNextPatientId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Gather all the data into a single object.
    const finalOccupation =
      occupation === "Other" ? otherOccupation : occupation;

    const displayAddress = selectedRegion
      ? streetAddress
        ? `${streetAddress}, ${
            barangays.find((b) => b.brgy_code === selectedBarangay)
              ?.brgy_name || ""
          }, ${
            cities.find((c) => c.city_code === selectedCity)?.city_name || ""
          }, ${
            provinces.find((p) => p.province_code === selectedProvince)
              ?.province_name || ""
          }, ${
            regions.find((r) => r.region_code === selectedRegion)
              ?.region_name || ""
          }`
        : `${
            barangays.find((b) => b.brgy_code === selectedBarangay)
              ?.brgy_name || ""
          }, ${
            cities.find((c) => c.city_code === selectedCity)?.city_name || ""
          }, ${
            provinces.find((p) => p.province_code === selectedProvince)
              ?.province_name || ""
          }, ${
            regions.find((r) => r.region_code === selectedRegion)
              ?.region_name || ""
          }`
      : address || "";

    const addressCombined = selectedRegion
      ? `${
          barangays.find((b) => b.brgy_code === selectedBarangay)?.brgy_name ||
          ""
        }, ${
          cities.find((c) => c.city_code === selectedCity)?.city_name || ""
        }, ${
          provinces.find((p) => p.province_code === selectedProvince)
            ?.province_name || ""
        }, ${
          regions.find((r) => r.region_code === selectedRegion)?.region_name ||
          ""
        }`
      : address || "";

    const regionName = regions.find(
      (r) => r.region_code === selectedRegion
    )?.region_name;
    const provinceName = provinces.find(
      (p) => p.province_code === selectedProvince
    )?.province_name;
    const cityName = cities.find(
      (c) => c.city_code === selectedCity
    )?.city_name;
    const barangayName = barangays.find(
      (b) => b.brgy_code === selectedBarangay
    )?.brgy_name;

    const newPatientData = {
      // Profile Data
      _id: patientId,
      patientId: patientId,
      firstName,
      middleName,
      lastName,
      dob,
      age: parseInt(age),
      gender,
      address: displayAddress,
      addressCombined,
      region: regionName || "",
      province: provinceName || "",
      city: cityName || "",
      barangay: barangayName || "",
      street_subdivision: streetAddress || "",
      contact,
      occupation: finalOccupation,
      civilStatus,
      referralBy,
      ageCategory,
      // Medical History Data
      ocularHistory,
      healthHistory,
      familyMedicalHistory,
      medications,
      allergies,
      occupationalHistoryMH,
      digitalHistory,
      // Initial Visit Data
      chiefComplaint,
      associatedComplaint,
      diagnosis,
      treatmentPlan,
    };

    // 2. Call the parent's function and pass the data up.
    //    The parent will handle the API calls and refreshing the list.
    handleAddPatient(newPatientData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fadeIn shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaPlus className="mr-3 text-deep-red" />
              Add New Patient
            </h2>
            <button
              onClick={handleCloseModal}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Patient ID
                    </label>
                    <input
                      type="text"
                      value={patientId}
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={handleDobChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Age</label>
                    <input
                      type="text"
                      value={age}
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Age Category
                    </label>
                    <input
                      type="text"
                      value={ageCategory}
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-gray-700 mb-2">Address</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <select
                        value={selectedRegion}
                        onChange={(e) => {
                          setSelectedRegion(e.target.value);
                          setSelectedProvince("");
                          setSelectedCity("");
                          setSelectedBarangay("");
                        }}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                      >
                        <option value="">Select Region</option>
                        {regions.map((r) => (
                          <option key={r.region_code} value={r.region_code}>
                            {r.region_name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedProvince}
                        onChange={(e) => {
                          setSelectedProvince(e.target.value);
                          setSelectedCity("");
                          setSelectedBarangay("");
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                      >
                        <option value="">Select Province</option>
                        {filteredProvinces.map((p) => (
                          <option key={p.province_code} value={p.province_code}>
                            {p.province_name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedCity}
                        onChange={(e) => {
                          setSelectedCity(e.target.value);
                          setSelectedBarangay("");
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                      >
                        <option value="">Select City / Municipality</option>
                        {filteredCities.map((c) => (
                          <option key={c.city_code} value={c.city_code}>
                            {c.city_name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedBarangay}
                        onChange={(e) => setSelectedBarangay(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                      >
                        <option value="">Select Barangay</option>
                        {filteredBarangays.map((b) => (
                          <option key={b.brgy_code} value={b.brgy_code}>
                            {b.brgy_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="Street / Subdivision (optional)"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Contact</label>
                    <input
                      type="number"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                    />
                  </div>
                  {/* --- Start of modified code --- */}
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Occupation
                    </label>
                    <select
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                    >
                      <option value="">Select Occupation</option>
                      {occupationOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>

                    {occupation === "Other" && (
                      <input
                        type="text"
                        value={otherOccupation}
                        onChange={(e) => setOtherOccupation(e.target.value)}
                        placeholder="Please specify occupation"
                        required
                        className="w-full mt-2 px-4 py-2.5 border border-gray-300 rounded-xl"
                      />
                    )}
                  </div>
                  {/* --- End of modified code --- */}
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Civil Status
                    </label>
                    <select
                      value={civilStatus}
                      onChange={(e) => setCivilStatus(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                    >
                      <option value="">Select Civil Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Legally Separated">
                        Legally Separated
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Referral By
                    </label>
                    <input
                      type="text"
                      value={referralBy}
                      onChange={(e) => setReferralBy(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">
                  Medical History
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Ocular History
                    </label>
                    <textarea
                      value={ocularHistory}
                      onChange={(e) => setOcularHistory(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Health History
                    </label>
                    <textarea
                      value={healthHistory}
                      onChange={(e) => setHealthHistory(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Family Medical History
                    </label>
                    <textarea
                      value={familyMedicalHistory}
                      onChange={(e) => setFamilyMedicalHistory(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Medications
                    </label>
                    <textarea
                      value={medications}
                      onChange={(e) => setMedications(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Allergies
                    </label>
                    <textarea
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Occupational History
                    </label>
                    <textarea
                      value={occupationalHistoryMH}
                      onChange={(e) => setOccupationalHistoryMH(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Digital History (Screen Time)
                    </label>
                    <input
                      type="text"
                      value={digitalHistory}
                      onChange={(e) => setDigitalHistory(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-5 rounded-xl mt-6">
              <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">
                Visit Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Chief Complaint
                  </label>
                  <textarea
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Associated Complaint
                  </label>
                  <textarea
                    value={associatedComplaint}
                    onChange={(e) => setAssociatedComplaint(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Diagnosis</label>
                  <textarea
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Treatment Plan
                  </label>
                  <textarea
                    value={treatmentPlan}
                    onChange={(e) => setTreatmentPlan(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-deep-red to-dark-red text-white rounded-xl hover:opacity-90 transition-opacity duration-200 flex items-center"
              >
                <FaPlus className="mr-2" /> Add Patient
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPatientModal;
