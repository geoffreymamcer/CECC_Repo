// src/components/PatientInformationModal.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import {
  FaUserMd,
  FaTimes,
  FaEdit,
  FaTrash,
  FaFileMedical,
  FaStethoscope,
  FaNotesMedical,
  FaFileInvoice,
  FaEye,
  FaDownload,
} from "react-icons/fa";
import {
  IoMdPerson,
  IoMdCall,
  IoMdMail,
  IoMdHome,
  IoMdClipboard,
} from "react-icons/io";

import NewVisitModal from "./NewVisitModal";
import InvoiceInputModal from "./InvoiceModal";
import regions from "../../services/phAddress/region.json";
import provinces from "../../services/phAddress/province.json";
import cities from "../../services/phAddress/city.json";
import barangays from "../../services/phAddress/barangay.json";

const PatientInformationModal = ({
  patient,
  handleCloseModal,
  handleDeletePatient,
  onDataUpdate,
}) => {
  const [activeTab, setActiveTab] = useState("personal");

  // Centralized states
  const [patientDetails, setPatientDetails] = useState(null);
  const [visitHistory, setVisitHistory] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);

  const [selectedVisitDate, setSelectedVisitDate] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showNewVisitModal, setShowNewVisitModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const currentUser = "Dr. Smith";

  // Grouped form data
  const [personalFormData, setPersonalFormData] = useState({
    fullName: "",
    dob: "",
    age: "",
    email: "",
    contact: "",
    occupation: "",
    civilStatus: "",
    referralBy: "",
    gender: "",
    ageCategory: "",
  });

  const [addressFormData, setAddressFormData] = useState({
    displayAddress: "",
    selectedRegion: "",
    selectedProvince: "",
    selectedCity: "",
    selectedBarangay: "",
    streetAddress: "",
  });

  const [medicalHistoryData, setMedicalHistoryData] = useState({
    ocularHistory: "",
    healthHistory: "",
    familyMedicalHistory: "",
    medications: "",
    allergies: "",
    occupationalHistory: "",
    digitalHistory: "",
  });

  const [currentVisitDetails, setCurrentVisitDetails] = useState({
    chiefComplaint: "",
    associatedComplaint: "",
    diagnosis: "",
    treatmentPlan: "",
    visitDate: "",
    doctor: "",
    prescriptions: "",
    notes: "",
  });

  // Memoized derived helpers
  const filteredProvinces = useMemo(() => {
    if (!addressFormData.selectedRegion) return [];
    return provinces.filter(
      (p) => p.region_code === addressFormData.selectedRegion
    );
  }, [addressFormData.selectedRegion]);

  const filteredCities = useMemo(() => {
    if (!addressFormData.selectedProvince) return [];
    return cities.filter(
      (c) => c.province_code === addressFormData.selectedProvince
    );
  }, [addressFormData.selectedProvince]);

  const filteredBarangays = useMemo(() => {
    if (!addressFormData.selectedCity) return [];
    return barangays.filter(
      (b) => b.city_code === addressFormData.selectedCity
    );
  }, [addressFormData.selectedCity]);

  const patientId = useMemo(
    () => patient && (patient._id || patient.patientId || patient.id),
    [patient]
  );

  // Helper: age category
  const getAgeCategory = (calculatedAge) => {
    if (calculatedAge >= 0 && calculatedAge <= 12) return "Child: 0-12";
    if (calculatedAge >= 13 && calculatedAge <= 19) return "Teen: 13-19";
    if (calculatedAge >= 20 && calculatedAge <= 39) return "Adult: 20-39";
    if (calculatedAge >= 40 && calculatedAge <= 59) return "Middle Age: 40-59";
    if (calculatedAge >= 60) return "Senior: 60 & up";
    return "";
  };

  // Fetch all required data concurrently
  const fetchAllData = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    const headers = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const medicalHistoryPromise = axios
        .get(`http://localhost:5000/api/medicalhistory/${patientId}`, headers)
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            // Patient has no medical history record, which is a valid scenario.
            // We return an object that mimics a successful response with null data
            // to prevent Promise.all from failing.
            return { data: null };
          }
          // For any other error, re-throw it so it's caught by the main catch block.
          console.error("Error fetching medical history:", error); // Log the error for other cases
          throw error;
        });

      const [profileRes, medHistoryRes, visitRes, invoiceRes] =
        await Promise.all([
          axios.get(
            `http://localhost:5000/api/profiles/id/${patientId}`,
            headers
          ),
          medicalHistoryPromise, // Use the promise with the attached catch handler
          axios.get(
            `http://localhost:5000/api/visits/patient/${patientId}`,
            headers
          ),
          axios.get(
            `http://localhost:5000/api/invoices/patient/${patientId}`,
            headers
          ),
        ]);
      // END OF UPDATED CODE BLOCK

      // Profile
      const profileData = profileRes.data;
      setPatientDetails(profileData);

      setPersonalFormData({
        fullName: [
          profileData.firstName,
          profileData.middleName,
          profileData.lastName,
        ]
          .filter(Boolean)
          .join(" "),
        dob: profileData.dob ? profileData.dob.slice(0, 10) : "",
        age: profileData.age || "",
        email: profileData.email || "",
        contact: profileData.contact || "",
        occupation: profileData.occupation || "",
        civilStatus: profileData.civilStatus || "",
        referralBy: profileData.referralBy || "",
        gender: profileData.gender || "",
        ageCategory: profileData.ageCategory || "",
      });

      // Address mapping: convert names to codes
      const regionObj = regions.find(
        (r) => r.region_name === profileData.region
      );
      const provinceObj = provinces.find(
        (p) =>
          p.province_name === profileData.province &&
          (!regionObj || p.region_code === regionObj.region_code)
      );
      const cityObj = cities.find(
        (c) =>
          c.city_name === profileData.city &&
          (!provinceObj || c.province_code === provinceObj.province_code)
      );
      const barangayObj = barangays.find(
        (b) =>
          b.brgy_name === profileData.barangay &&
          (!cityObj || b.city_code === cityObj.city_code)
      );

      setAddressFormData({
        displayAddress:
          profileData.address || profileData.addressCombined || "",
        selectedRegion: regionObj?.region_code || "",
        selectedProvince: provinceObj?.province_code || "",
        selectedCity: cityObj?.city_code || "",
        selectedBarangay: barangayObj?.brgy_code || "",
        streetAddress: profileData.street_subdivision || "",
      });

      // Medical history
      setMedicalHistoryData(
        medHistoryRes && medHistoryRes.data
          ? {
              ocularHistory: medHistoryRes.data.ocularHistory || "",
              healthHistory: medHistoryRes.data.healthHistory || "",
              familyMedicalHistory:
                medHistoryRes.data.familyMedicalHistory || "",
              medications: medHistoryRes.data.medications || "",
              allergies: medHistoryRes.data.allergies || "",
              occupationalHistory: medHistoryRes.data.occupationalHistory || "",
              digitalHistory: medHistoryRes.data.digitalHistory || "",
            }
          : {
              ocularHistory: "",
              healthHistory: "",
              familyMedicalHistory: "",
              medications: "",
              allergies: "",
              occupationalHistory: "",
              digitalHistory: "",
            }
      );

      // Visits
      const sortedVisits = (visitRes.data || []).sort(
        (a, b) => new Date(b.visitDate) - new Date(a.visitDate)
      );
      setVisitHistory(sortedVisits);
      if (sortedVisits.length > 0) {
        const latestVisit = sortedVisits[0];
        setSelectedVisitDate(latestVisit.visitDate);
        setCurrentVisitDetails({
          chiefComplaint: latestVisit.chiefComplaint || "",
          associatedComplaint: latestVisit.associatedComplaint || "",
          diagnosis: latestVisit.diagnosis || "",
          treatmentPlan: latestVisit.treatmentPlan || "",
          visitDate: latestVisit.visitDate || "",
          doctor: latestVisit.doctor || "",
          prescriptions: latestVisit.prescriptions || "",
          notes: latestVisit.notes || "",
        });
      } else {
        setCurrentVisitDetails({
          chiefComplaint: "",
          associatedComplaint: "",
          diagnosis: "",
          treatmentPlan: "",
          visitDate: "",
          doctor: "",
          prescriptions: "",
          notes: "",
        });
        setSelectedVisitDate("");
      }

      // Invoices
      setInvoices(invoiceRes.data || []);
    } catch (err) {
      // START OF UPDATED CODE BLOCK
      console.error("Error fetching patient data:", err);
      // The specific 404 check is no longer needed here, as it's handled above.
      // This catch block will now only handle other fatal API errors.
      setError("Failed to fetch patient data.");
      // END OF UPDATED CODE BLOCK
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Handlers
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    const newForm = { ...personalFormData, [name]: value };

    if (name === "dob") {
      let calculatedAge = "";
      let ageCategory = "";
      if (value) {
        const birthDate = new Date(value);
        const today = new Date();
        calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (
          monthDifference < 0 ||
          (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
          calculatedAge--;
        }
        ageCategory = getAgeCategory(calculatedAge);
      }
      newForm.age = calculatedAge ? calculatedAge.toString() : "";
      newForm.ageCategory = ageCategory;
    }

    setPersonalFormData(newForm);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMedicalHistoryChange = (e) => {
    const { name, value } = e.target;
    setMedicalHistoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVisitDateChange = (e) => {
    const date = e.target.value;
    setSelectedVisitDate(date);
    const selectedVisit = visitHistory.find((v) => v.visitDate === date);
    if (selectedVisit) {
      setCurrentVisitDetails({
        chiefComplaint: selectedVisit.chiefComplaint || "",
        associatedComplaint: selectedVisit.associatedComplaint || "",
        diagnosis: selectedVisit.diagnosis || "",
        treatmentPlan: selectedVisit.treatmentPlan || "",
        visitDate: selectedVisit.visitDate || "",
        doctor: selectedVisit.doctor || "",
        prescriptions: selectedVisit.prescriptions || "",
        notes: selectedVisit.notes || "",
      });
    }
  };

  const handleAddNewVisit = () => setShowNewVisitModal(true);
  const handleCloseNewVisitModal = () => setShowNewVisitModal(false);
  const handleNewVisitSave = () => {
    setShowNewVisitModal(false);
    fetchAllData();
  };

  const handleViewPDF = async (invoiceId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/invoices/${invoiceId}/pdf`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Error viewing PDF:", error);
      alert("Failed to view PDF. Please try again.");
    }
  };

  const handleDownloadPDF = async (invoiceId, invoiceNumber) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/invoices/${invoiceId}/pdf`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `invoice-${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  const handleCreateInvoice = () => {
    setShowInvoiceModal(true);
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    if (patientDetails) {
      setPersonalFormData({
        fullName: [
          patientDetails.firstName,
          patientDetails.middleName,
          patientDetails.lastName,
        ]
          .filter(Boolean)
          .join(" "),
        dob: patientDetails.dob ? patientDetails.dob.slice(0, 10) : "",
        age: patientDetails.age || "",
        email: patientDetails.email || "",
        contact: patientDetails.contact || "",
        occupation: patientDetails.occupation || "",
        civilStatus: patientDetails.civilStatus || "",
        referralBy: patientDetails.referralBy || "",
        gender: patientDetails.gender || "",
        ageCategory: patientDetails.ageCategory || "",
      });

      setAddressFormData((prev) => ({
        ...prev,
        displayAddress:
          patientDetails.address ||
          patientDetails.addressCombined ||
          prev.displayAddress,
        streetAddress: patientDetails.street_subdivision || prev.streetAddress,
      }));
    }
  };

  const handleSave = async () => {
    if (!patientId) return;
    const token = localStorage.getItem("token");
    const headers = { headers: { Authorization: `Bearer ${token}` } };

    try {
      // Build name parts
      const nameParts = (personalFormData.fullName || "").trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName =
        nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
      const middleName =
        nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";

      // Build display address
      let displayAddress = addressFormData.displayAddress || "";
      if (addressFormData.selectedRegion) {
        const regionName =
          regions.find((r) => r.region_code === addressFormData.selectedRegion)
            ?.region_name || "";
        const provinceName =
          provinces.find(
            (p) => p.province_code === addressFormData.selectedProvince
          )?.province_name || "";
        const cityName =
          cities.find((c) => c.city_code === addressFormData.selectedCity)
            ?.city_name || "";
        const barangayName =
          barangays.find(
            (b) => b.brgy_code === addressFormData.selectedBarangay
          )?.brgy_name || "";
        const combined = [barangayName, cityName, provinceName, regionName]
          .filter(Boolean)
          .join(", ");
        displayAddress = addressFormData.streetAddress
          ? `${addressFormData.streetAddress}, ${combined}`
          : combined || displayAddress;
      }

      const profilePayload = {
        firstName,
        middleName,
        lastName,
        dob: personalFormData.dob || "",
        age: personalFormData.age
          ? parseInt(personalFormData.age, 10)
          : undefined,
        gender: personalFormData.gender || "",
        email: personalFormData.email || "",
        contact: personalFormData.contact || "",
        occupation: personalFormData.occupation || "",
        civilStatus: personalFormData.civilStatus || "",
        referralBy: personalFormData.referralBy || "",
        ageCategory: personalFormData.ageCategory || "",
        address: displayAddress,
        addressCombined: displayAddress,
        region:
          regions.find((r) => r.region_code === addressFormData.selectedRegion)
            ?.region_name ||
          patientDetails?.region ||
          "",
        province:
          provinces.find(
            (p) => p.province_code === addressFormData.selectedProvince
          )?.province_name ||
          patientDetails?.province ||
          "",
        city:
          cities.find((c) => c.city_code === addressFormData.selectedCity)
            ?.city_name ||
          patientDetails?.city ||
          "",
        barangay:
          barangays.find(
            (b) => b.brgy_code === addressFormData.selectedBarangay
          )?.brgy_name ||
          patientDetails?.barangay ||
          "",
        street_subdivision:
          addressFormData.streetAddress ||
          patientDetails?.street_subdivision ||
          "",
      };

      // Update profile
      const profileUpdatePromise = axios.put(
        `http://localhost:5000/api/profiles/${patientId}`,
        profilePayload,
        headers
      );

      // Upsert medical history for patient
      const medUpdatePromise = axios.put(
        `http://localhost:5000/api/medicalhistory/patient/${patientId}`,
        medicalHistoryData,
        headers
      );

      await Promise.all([profileUpdatePromise, medUpdatePromise]);

      alert("Changes saved successfully!");
      setIsEditing(false);
      if (typeof onDataUpdate === "function") onDataUpdate();
      fetchAllData();
    } catch (err) {
      console.error("Failed to save changes:", err);
      alert("Failed to save changes. Please try again.");
    }
  };

  // display full name
  const fullName = patientDetails
    ? [
        patientDetails.firstName,
        patientDetails.middleName,
        patientDetails.lastName,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  // START OF UPDATED CODE BLOCK
  // Helper to check if the medical history form data is empty
  const isMedicalHistoryEmpty = !Object.values(medicalHistoryData).some(
    (value) => value
  );
  // END OF UPDATED CODE BLOCK

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="text-white text-xl">Loading Patient Data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg">
          <h3 className="text-red-500 text-xl mb-4">Error</h3>
          <p>{error}</p>
          <button
            onClick={handleCloseModal}
            className="mt-4 px-4 py-2 bg-gray-200 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fadeIn shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaUserMd className="mr-3 text-deep-red" />
              Patient Details
            </h2>
            <button
              onClick={handleCloseModal}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row mb-8">
            <div className="flex justify-center md:justify-start mb-6 md:mb-0 md:mr-8">
              <div className="bg-gradient-to-br from-deep-red to-dark-red p-1 rounded-full">
                <div className="bg-white p-1 rounded-full">
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-32 h-32 flex items-center justify-center">
                    {patientDetails?.profilePicture ? (
                      <img
                        src={patientDetails.profilePicture}
                        alt={fullName}
                        className="w-32 h-32 rounded-full object-cover"
                      />
                    ) : (
                      <IoMdPerson className="text-gray-400 text-5xl" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {fullName}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                  <IoMdPerson className="text-deep-red mr-3 text-xl" />
                  <div>
                    <p className="text-gray-600 text-sm">Date of Birth</p>
                    <p className="font-medium">{personalFormData.dob}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <IoMdCall className="text-deep-red mr-3 text-xl" />
                  <div>
                    <p className="text-gray-600 text-sm">Phone</p>
                    <p className="font-medium">{personalFormData.contact}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <IoMdMail className="text-deep-red mr-3 text-xl" />
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="font-medium">{personalFormData.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <IoMdHome className="text-deep-red mr-3 text-xl" />
                  <div>
                    <p className="text-gray-600 text-sm">Address</p>
                    <p className="font-medium">
                      {addressFormData.displayAddress || ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <p className="text-xs text-gray-600">Blood Type</p>
                  <p className="font-bold text-blue-700">
                    {patientDetails?.bloodType}
                  </p>
                </div>
                <div className="bg-green-50 px-4 py-2 rounded-lg">
                  <p className="text-xs text-gray-600">Last Visit</p>
                  <p className="font-bold text-green-700">
                    {patientDetails?.lastVisit}
                  </p>
                </div>
                <div className="bg-purple-50 px-4 py-2 rounded-lg">
                  <p className="text-xs text-gray-600">Status</p>
                  <p
                    className={`font-bold ${
                      patientDetails?.status === "Active"
                        ? "text-green-700"
                        : "text-yellow-700"
                    }`}
                  >
                    {patientDetails?.status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-6">
              <button
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === "personal"
                    ? "text-deep-red border-b-2 border-deep-red"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("personal")}
              >
                Personal Details
              </button>
              <button
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === "medical"
                    ? "text-deep-red border-b-2 border-deep-red"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("medical")}
              >
                Medical History
              </button>
              <button
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === "current"
                    ? "text-deep-red border-b-2 border-deep-red"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("current")}
              >
                Visit Specific Details
              </button>
              <button
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === "invoice"
                    ? "text-deep-red border-b-2 border-deep-red"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("invoice")}
              >
                Invoice
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mb-8">
            {activeTab === "personal" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                    <FaFileMedical className="mr-2 text-deep-red" />
                    Personal Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label
                        className="text-sm text-gray-600"
                        htmlFor="fullName"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={personalFormData.fullName}
                        onChange={handlePersonalChange}
                        disabled={!isEditing}
                        className="font-medium w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600" htmlFor="dob">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={personalFormData.dob || ""}
                        onChange={handlePersonalChange}
                        disabled={!isEditing}
                        className="font-medium w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600" htmlFor="age">
                        Age
                      </label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        value={personalFormData.age}
                        onChange={handlePersonalChange}
                        disabled={!isEditing}
                        className="font-medium w-full"
                      />
                    </div>
                    <div>
                      <label
                        className="text-sm text-gray-600"
                        htmlFor="ageCategory"
                      >
                        Age Category
                      </label>
                      <input
                        type="text"
                        id="ageCategory"
                        name="ageCategory"
                        value={personalFormData.ageCategory}
                        onChange={handlePersonalChange}
                        disabled={!isEditing}
                        className="font-medium w-full"
                      />
                    </div>
                    <div>
                      <label
                        className="text-sm text-gray-600"
                        htmlFor="occupation"
                      >
                        Occupation
                      </label>
                      <input
                        type="text"
                        id="occupation"
                        name="occupation"
                        value={personalFormData.occupation}
                        onChange={handlePersonalChange}
                        disabled={!isEditing}
                        className="font-medium w-full"
                      />
                    </div>
                    <div>
                      <label
                        className="text-sm text-gray-600"
                        htmlFor="contact"
                      >
                        Contact Number
                      </label>
                      <input
                        type="text"
                        id="contact"
                        name="contact"
                        value={personalFormData.contact}
                        onChange={handlePersonalChange}
                        disabled={!isEditing}
                        className="font-medium w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600" htmlFor="email">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={personalFormData.email}
                        onChange={handlePersonalChange}
                        disabled={!isEditing}
                        className="font-medium w-full"
                      />
                    </div>
                    <div>
                      <label
                        className="text-sm text-gray-600"
                        htmlFor="address"
                      >
                        Physical Address
                      </label>
                      {!isEditing ? (
                        <div className="font-medium w-full space-y-1">
                          {addressFormData.selectedRegion ||
                          addressFormData.selectedProvince ||
                          addressFormData.selectedCity ||
                          addressFormData.selectedBarangay ? (
                            <div className="grid grid-cols-1 gap-1">
                              <p>
                                <span className="text-gray-500 text-sm">
                                  Region:{" "}
                                </span>
                                <span>
                                  {addressFormData.selectedRegion
                                    ? regions.find(
                                        (r) =>
                                          r.region_code ===
                                          addressFormData.selectedRegion
                                      )?.region_name
                                    : addressFormData.displayAddress || ""}
                                </span>
                              </p>
                              <p>
                                <span className="text-gray-500 text-sm">
                                  Province:{" "}
                                </span>
                                <span>
                                  {addressFormData.selectedProvince
                                    ? provinces.find(
                                        (p) =>
                                          p.province_code ===
                                          addressFormData.selectedProvince
                                      )?.province_name
                                    : ""}
                                </span>
                              </p>
                              <p>
                                <span className="text-gray-500 text-sm">
                                  City:{" "}
                                </span>
                                <span>
                                  {addressFormData.selectedCity
                                    ? cities.find(
                                        (c) =>
                                          c.city_code ===
                                          addressFormData.selectedCity
                                      )?.city_name
                                    : ""}
                                </span>
                              </p>
                              <p>
                                <span className="text-gray-500 text-sm">
                                  Barangay:{" "}
                                </span>
                                <span>
                                  {addressFormData.selectedBarangay
                                    ? barangays.find(
                                        (b) =>
                                          b.brgy_code ===
                                          addressFormData.selectedBarangay
                                      )?.brgy_name
                                    : ""}
                                </span>
                              </p>
                              <p>
                                <span className="text-gray-500 text-sm">
                                  Street:{" "}
                                </span>
                                <span>
                                  {addressFormData.streetAddress || ""}
                                </span>
                              </p>
                            </div>
                          ) : (
                            <p>{addressFormData.displayAddress}</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <select
                              name="selectedRegion"
                              value={addressFormData.selectedRegion}
                              onChange={(e) => {
                                handleAddressChange(e);
                                // reset dependent selects
                                setAddressFormData((prev) => ({
                                  ...prev,
                                  selectedProvince: "",
                                  selectedCity: "",
                                  selectedBarangay: "",
                                  selectedRegion: e.target.value,
                                }));
                              }}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                            >
                              <option value="">Select Region</option>
                              {regions.map((r) => (
                                <option
                                  key={r.region_code}
                                  value={r.region_code}
                                >
                                  {r.region_name}
                                </option>
                              ))}
                            </select>

                            <select
                              name="selectedProvince"
                              value={addressFormData.selectedProvince}
                              onChange={(e) => {
                                handleAddressChange(e);
                                setAddressFormData((prev) => ({
                                  ...prev,
                                  selectedCity: "",
                                  selectedBarangay: "",
                                  selectedProvince: e.target.value,
                                }));
                              }}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                            >
                              <option value="">Select Province</option>
                              {filteredProvinces.map((p) => (
                                <option
                                  key={p.province_code}
                                  value={p.province_code}
                                >
                                  {p.province_name}
                                </option>
                              ))}
                            </select>

                            <select
                              name="selectedCity"
                              value={addressFormData.selectedCity}
                              onChange={(e) => {
                                handleAddressChange(e);
                                setAddressFormData((prev) => ({
                                  ...prev,
                                  selectedCity: e.target.value,
                                  selectedBarangay: "",
                                }));
                              }}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                            >
                              <option value="">
                                Select City / Municipality
                              </option>
                              {filteredCities.map((c) => (
                                <option key={c.city_code} value={c.city_code}>
                                  {c.city_name}
                                </option>
                              ))}
                            </select>

                            <select
                              name="selectedBarangay"
                              value={addressFormData.selectedBarangay}
                              onChange={handleAddressChange}
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
                            name="streetAddress"
                            value={addressFormData.streetAddress}
                            onChange={handleAddressChange}
                            placeholder="Street / Subdivision (optional)"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label
                        className="text-sm text-gray-600"
                        htmlFor="civilStatus"
                      >
                        Civil Status
                      </label>
                      <select
                        id="civilStatus"
                        name="civilStatus"
                        value={personalFormData.civilStatus}
                        onChange={handlePersonalChange}
                        disabled={!isEditing}
                        className="font-medium w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select Civil Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600" htmlFor="gender">
                        Gender
                      </label>
                      <input
                        type="text"
                        id="gender"
                        name="gender"
                        value={personalFormData.gender}
                        onChange={handlePersonalChange}
                        disabled={!isEditing}
                        className="font-medium w-full"
                      />
                    </div>
                    <div>
                      <label
                        className="text-sm text-gray-600"
                        htmlFor="referralBy"
                      >
                        Referral By
                      </label>
                      <input
                        type="text"
                        id="referralBy"
                        name="referralBy"
                        value={personalFormData.referralBy}
                        onChange={handlePersonalChange}
                        disabled={!isEditing}
                        className="font-medium w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                    <FaStethoscope className="mr-2 text-deep-red" />
                    Physical Attributes
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Height</p>
                      <p className="text-xl font-bold text-deep-red">
                        {patient.height}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Weight</p>
                      <p className="text-xl font-bold text-deep-red">
                        {patient.weight}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Blood Type</p>
                      <p className="text-xl font-bold text-deep-red">
                        {patient.bloodType}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">BMI</p>
                      <p className="text-xl font-bold text-deep-red">24.8</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "medical" && (
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                  <FaNotesMedical className="mr-2 text-deep-red" />
                  Medical History
                </h4>
                {/* START OF UPDATED CODE BLOCK */}
                {isMedicalHistoryEmpty && !isEditing ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 italic">
                      No medical history records found for this patient.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label
                        className="text-sm text-gray-600 mb-1 block"
                        htmlFor="ocularHistory"
                      >
                        Ocular History
                      </label>
                      <input
                        type="text"
                        id="ocularHistory"
                        name="ocularHistory"
                        value={medicalHistoryData.ocularHistory}
                        onChange={handleMedicalHistoryChange}
                        disabled={!isEditing}
                        className="font-medium w-full"
                      />
                    </div>
                    <div>
                      <label
                        className="text-sm text-gray-600 mb-1 block"
                        htmlFor="healthHistory"
                      >
                        Health History
                      </label>
                      <input
                        type="text"
                        id="healthHistory"
                        name="healthHistory"
                        value={medicalHistoryData.healthHistory}
                        onChange={handleMedicalHistoryChange}
                        disabled={!isEditing}
                        className="font-medium w-full"
                      />
                    </div>
                    <div>
                      <label
                        className="text-sm text-gray-600 mb-1 block"
                        htmlFor="familyMedicalHistory"
                      >
                        Family Medical History
                      </label>
                      <input
                        type="text"
                        id="familyMedicalHistory"
                        name="familyMedicalHistory"
                        value={medicalHistoryData.familyMedicalHistory}
                        onChange={handleMedicalHistoryChange}
                        disabled={!isEditing}
                        className="font-medium w-full"
                      />
                    </div>
                    <div>
                      <label
                        className="text-sm text-gray-600 mb-1 block"
                        htmlFor="medications"
                      >
                        Medications
                      </label>
                      <input
                        type="text"
                        id="medications"
                        name="medications"
                        value={medicalHistoryData.medications}
                        onChange={handleMedicalHistoryChange}
                        disabled={!isEditing}
                        className="font-medium w-full"
                      />
                    </div>
                    <div>
                      <label
                        className="text-sm text-gray-600 mb-1 block"
                        htmlFor="allergies"
                      >
                        Allergies
                      </label>
                      <input
                        type="text"
                        id="allergies"
                        name="allergies"
                        value={medicalHistoryData.allergies}
                        onChange={handleMedicalHistoryChange}
                        disabled={!isEditing}
                        className="font-medium w-full"
                      />
                    </div>
                    <div>
                      <label
                        className="text-sm text-gray-600 mb-1 block"
                        htmlFor="occupationalHistory"
                      >
                        Occupational History
                      </label>
                      <input
                        type="text"
                        id="occupationalHistory"
                        name="occupationalHistory"
                        value={medicalHistoryData.occupationalHistory}
                        onChange={handleMedicalHistoryChange}
                        disabled={!isEditing}
                        className="font-medium w-full"
                      />
                    </div>
                    <div>
                      <label
                        className="text-sm text-gray-600 mb-1 block"
                        htmlFor="digitalHistory"
                      >
                        Digital History
                      </label>
                      <input
                        type="text"
                        id="digitalHistory"
                        name="digitalHistory"
                        value={medicalHistoryData.digitalHistory}
                        onChange={handleMedicalHistoryChange}
                        disabled={!isEditing}
                        className="font-medium w-full"
                      />
                    </div>
                  </div>
                )}
                {/* END OF UPDATED CODE BLOCK */}
              </div>
            )}

            {activeTab === "current" && (
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-gray-800 flex items-center">
                    <IoMdClipboard className="mr-2 text-deep-red" />
                    Visit Specific Details
                  </h4>
                  <div className="flex items-center space-x-2 w-1/3">
                    {visitHistory.length > 0 && (
                      <>
                        <label
                          htmlFor="visitDate"
                          className="text-sm text-gray-600 block mb-1"
                        >
                          Select Visit Date
                        </label>
                        <select
                          id="visitDate"
                          name="visitDate"
                          value={selectedVisitDate}
                          onChange={handleVisitDateChange}
                          className="p-2 border rounded-md w-full"
                        >
                          {visitHistory.map((visit) => (
                            <option key={visit._id} value={visit.visitDate}>
                              {new Date(visit.visitDate).toLocaleDateString()}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={handleAddNewVisit}
                      className="ml-2 px-3 py-2 bg-gradient-to-r from-deep-red to-dark-red text-white rounded-xl hover:opacity-90 transition-all text-sm"
                    >
                      + Add New Visit
                    </button>
                  </div>
                </div>

                {visitHistory.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Visit Date</p>
                        <p className="font-medium">
                          {currentVisitDetails.visitDate
                            ? new Date(
                                currentVisitDetails.visitDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Chief Complaint</p>
                        <p className="font-medium">
                          {currentVisitDetails.chiefComplaint ||
                            "No Chief Complaint"}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Associated Complaint
                        </p>
                        <p className="font-medium">
                          {currentVisitDetails.associatedComplaint ||
                            "No Associated Complaint"}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Diagnosis</p>
                        <p className="font-medium">
                          {currentVisitDetails.diagnosis || "No Diagnosis"}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Treatment Plan</p>
                        <p className="font-medium">
                          {currentVisitDetails.treatmentPlan ||
                            "No Available Treatment Plan"}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Assigned Doctor</p>
                        <p className="font-medium">
                          {currentVisitDetails.doctor}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Notes</p>
                        <p className="font-medium">
                          {currentVisitDetails.notes || "No notes available"}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">
                          Prescribed Medications
                        </p>
                        <p className="font-medium">
                          {currentVisitDetails.prescriptions}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>No visit history available for this patient.</p>
                )}
              </div>
            )}

            {activeTab === "invoice" && (
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-gray-800 flex items-center">
                    <FaFileInvoice className="mr-2 text-deep-red" />
                    Invoice Details
                  </h4>
                  <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="px-3 py-2 bg-gradient-to-r from-deep-red to-dark-red text-white rounded-xl hover:opacity-90 transition-all text-sm"
                  >
                    + Create Invoice
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg col-span-2">
                      <h5 className="font-bold text-gray-800 mb-3">
                        Recent Invoices
                      </h5>
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Invoice #</th>
                              <th className="text-left py-2">Date</th>
                              <th className="text-left py-2">Services</th>
                              <th className="text-right py-2">Amount</th>
                              <th className="text-right py-2">Status</th>
                              <th className="text-right py-2">Printables</th>
                            </tr>
                          </thead>
                          <tbody>
                            {isLoadingInvoices ? (
                              <tr>
                                <td colSpan="6" className="py-4 text-center">
                                  Loading invoices...
                                </td>
                              </tr>
                            ) : invoices.length === 0 ? (
                              <tr>
                                <td colSpan="6" className="py-4 text-center">
                                  No invoices found
                                </td>
                              </tr>
                            ) : (
                              invoices.map((invoice) => (
                                <tr key={invoice._id} className="border-b">
                                  <td className="py-2">
                                    {invoice.invoiceNumber}
                                  </td>
                                  <td className="py-2">
                                    {invoice.invoiceDate
                                      ? new Date(
                                          invoice.invoiceDate
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </td>
                                  <td className="py-2">
                                    {(invoice.items || [])
                                      .map((item) => item.description)
                                      .filter(Boolean)
                                      .join(", ") || "N/A"}
                                  </td>
                                  <td className="text-right py-2">
                                    ₱{(invoice.totalDue || 0).toFixed(2)}
                                  </td>
                                  <td className="text-right py-2">
                                    <span
                                      className={`px-2 py-1 rounded-full text-sm ${
                                        invoice.status === "paid"
                                          ? "bg-green-100 text-green-800"
                                          : invoice.status === "partially_paid"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {invoice.status === "paid"
                                        ? "Paid"
                                        : invoice.status === "partially_paid"
                                        ? "Partially Paid"
                                        : "Unpaid"}
                                    </span>
                                  </td>
                                  <td className="text-right py-2">
                                    <button
                                      onClick={() => handleViewPDF(invoice._id)}
                                      className="text-deep-red hover:text-dark-red mr-2"
                                      title="View PDF"
                                    >
                                      <FaEye />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDownloadPDF(
                                          invoice._id,
                                          invoice.invoiceNumber
                                        )
                                      }
                                      className="text-deep-red hover:text-dark-red"
                                      title="Download PDF"
                                    >
                                      <FaDownload />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg">
                      <h5 className="font-bold text-gray-800 mb-3">
                        Payment Summary
                      </h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Invoiced</span>
                          <span className="font-bold">
                            ₱
                            {invoices
                              .reduce(
                                (sum, inv) => sum + (inv.subtotal || 0),
                                0
                              )
                              .toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Paid Amount</span>
                          <span className="font-bold text-green-600">
                            ₱
                            {invoices
                              .reduce(
                                (sum, inv) => sum + (inv.amountPaid || 0),
                                0
                              )
                              .toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-gray-600">
                            Outstanding Balance
                          </span>
                          <span className="font-bold text-deep-red">
                            ₱
                            {invoices
                              .reduce(
                                (sum, inv) =>
                                  sum +
                                  ((inv.totalDue || 0) - (inv.amountPaid || 0)),
                                0
                              )
                              .toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg">
                      <h5 className="font-bold text-gray-800 mb-3">
                        Payment History
                      </h5>
                      <div className="space-y-2">
                        {invoices
                          .filter((inv) => (inv.amountPaid || 0) > 0)
                          .map((invoice) => (
                            <div key={invoice._id} className="text-sm">
                              <div className="flex justify-between mb-1">
                                <span>
                                  {invoice.updatedAt
                                    ? new Date(
                                        invoice.updatedAt
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </span>
                                <span className="text-green-600">
                                  ₱{(invoice.amountPaid || 0).toFixed(2)}
                                </span>
                              </div>
                              <p className="text-gray-600">
                                Payment for Invoice #
                                {invoice.invoiceNumber || "N/A"}
                              </p>
                            </div>
                          ))}
                        {!invoices.some((inv) => inv.amountPaid > 0) && (
                          <p className="text-gray-500 text-center py-2">
                            No payment history available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleCloseModal}
              className="px-5 py-2.5 border border-dark-red text-dark-red rounded-xl hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="px-5 py-2.5 bg-gradient-to-r from-deep-red to-dark-red text-white rounded-xl hover:opacity-90 transition-all flex items-center"
              >
                <FaEdit className="mr-2" /> Update Info
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 bg-gradient-to-r from-deep-red to-dark-red text-white rounded-xl hover:opacity-90 transition-all flex items-center"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-5 py-2.5 border border-dark-red text-dark-red rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={() => handleDeletePatient(patientId)}
              className="px-5 py-2.5 bg-gradient-to-r from-deep-red to-dark-red text-white rounded-xl hover:opacity-90 transition-all flex items-center"
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          </div>
        </div>
      </div>

      {showNewVisitModal && (
        <NewVisitModal
          isOpen={showNewVisitModal}
          patientId={patientId}
          onClose={handleCloseNewVisitModal}
          onSave={handleNewVisitSave}
        />
      )}

      {showInvoiceModal && (
        <InvoiceInputModal
          onClose={() => setShowInvoiceModal(false)}
          currentUser={currentUser}
          patientId={patientId}
        />
      )}
    </div>
  );
};

export default PatientInformationModal;
