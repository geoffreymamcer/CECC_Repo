// src/components/PatientInformationModal.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  FaUserMd,
  FaTimes,
  FaEdit,
  FaTrash,
  FaFileMedical,
  FaStethoscope,
  FaNotesMedical,
  FaPrescription,
  FaFileInvoice,
  FaEye,
  FaDownload,
  FaPrint,
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
}) => {
  const [activeTab, setActiveTab] = useState("personal");

  // --- Fetching logic from patient-info.jsx ---
  const [patientDetails, setPatientDetails] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [visitHistory, setVisitHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVisitDate, setSelectedVisitDate] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const currentUser = "Dr. Smith";

  // Handle viewing PDF
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

      // Create blob URL and open in new window
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Error viewing PDF:", error);
      alert("Failed to view PDF. Please try again.");
    }
  };

  // Handle downloading PDF
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

      // Create download link
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

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      if (!patient._id && !patient.patientId && !patient.id) return;

      setIsLoadingInvoices(true);
      try {
        const token = localStorage.getItem("token");
        const patientId = patient._id || patient.patientId || patient.id;
        const response = await axios.get(
          `http://localhost:5000/api/invoices/patient/${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInvoices(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setIsLoadingInvoices(false);
      }
    };

    fetchInvoices();
  }, [patient]);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    age: "",
    email: "",
    address: "",
    contact: "",
    occupation: "",
    civilStatus: "",
    referralBy: "",
    gender: "",
    ageCategory: "",
    // Visit details
    chiefComplaint: "",
    associatedComplaint: "",
    diagnosis: "",
    treatmentPlan: "",
    visitDate: "",
    doctor: "",
    prescriptions: "",
    notes: "",
  });
  // structured address fields for editing/view
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [streetAddress, setStreetAddress] = useState("");

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
  const [medicalHistoryData, setMedicalHistoryData] = useState({
    ocularHistory: "",
    healthHistory: "",
    familyMedicalHistory: "",
    medications: "",
    allergies: "",
    occupationalHistory: "",
    digitalHistory: "",
  });
  const [visitData, setVisitData] = useState([]);
  const [medicalHistoryId, setMedicalHistoryId] = useState(null);
  const [showNewVisitModal, setShowNewVisitModal] = useState(false);

  const getAgeCategory = (calculatedAge) => {
    if (calculatedAge >= 0 && calculatedAge <= 12) return "Child: 0-12";
    if (calculatedAge >= 13 && calculatedAge <= 19) return "Teen: 13-19";
    if (calculatedAge >= 20 && calculatedAge <= 39) return "Adult: 20-39";
    if (calculatedAge >= 40 && calculatedAge <= 59) return "Middle Age: 40-59";
    if (calculatedAge >= 60) return "Senior: 60 & up";
    return "";
  };

  const handleVisitDateChange = (e) => {
    const date = e.target.value;
    setSelectedVisitDate(date);

    const selectedVisit = visitData.find((visit) => visit.visitDate === date);

    if (selectedVisit) {
      setFormData((prev) => ({
        ...prev,
        chiefComplaint: selectedVisit.chiefComplaint || "",
        associatedComplaint: selectedVisit.associatedComplaint || "",
        diagnosis: selectedVisit.diagnosis || "",
        treatmentPlan: selectedVisit.treatmentPlan || "",
        visitDate: selectedVisit.visitDate || "",
        doctor: selectedVisit.doctor || "",
        prescriptions: selectedVisit.prescriptions || "",
        notes: selectedVisit.notes || "",
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dob") {
      // Calculate age and age category
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
      setFormData((prev) => ({
        ...prev,
        dob: value,
        age: calculatedAge ? calculatedAge.toString() : "",
        ageCategory,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCreateInvoice = () => {
    setShowInvoiceModal(true);
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    if (patientDetails) {
      setFormData({
        fullName: [
          patientDetails.firstName,
          patientDetails.middleName,
          patientDetails.lastName,
        ]
          .filter(Boolean)
          .join(" "),
        dob: patientDetails.dob || "",
        age: patientDetails.age || "",
        address: patientDetails.address || "",
        contact: patientDetails.contact || "",
        occupation: patientDetails.occupation || "",
        civilStatus: patientDetails.civilStatus || "",
        referralBy: patientDetails.referralBy || "",
        gender: patientDetails.gender || "",
        ageCategory: patientDetails.ageCategory || "",
        chiefComplaint: "",
        associatedComplaint: "",
        diagnosis: "",
        treatmentPlan: "",
        visitDate: "",
        doctor: "",
        prescriptions: "",
        notes: "",
      });
    }
  };

  const handleMedicalHistoryChange = (e) => {
    const { name, value } = e.target;
    setMedicalHistoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      // build structured address if editing and region selected
      let addressPayload;
      // Build display and combined strings
      let displayAddress = formData.address || "";
      let addressCombined = "";
      if (selectedRegion) {
        displayAddress = selectedRegion
          ? streetAddress
            ? `${streetAddress}, ${
                barangays.find((b) => b.brgy_code === selectedBarangay)
                  ?.brgy_name || ""
              }, ${
                cities.find((c) => c.city_code === selectedCity)?.city_name ||
                ""
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
                cities.find((c) => c.city_code === selectedCity)?.city_name ||
                ""
              }, ${
                provinces.find((p) => p.province_code === selectedProvince)
                  ?.province_name || ""
              }, ${
                regions.find((r) => r.region_code === selectedRegion)
                  ?.region_name || ""
              }`
          : formData.address || "";

        addressCombined = `${
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
        }`;
      } else {
        displayAddress = formData.address || "";
        // try to use existing addressCombined if present on patientDetails
        addressCombined = patientDetails?.addressCombined || "";
      }

      await axios.put(
        `http://localhost:5000/api/profiles/${
          patient._id || patient.patientId || patient.id
        }`,
        {
          firstName: formData.fullName.split(" ")[0],
          middleName: formData.fullName.split(" ").slice(1, -1).join(" ") || "",
          lastName: formData.fullName.split(" ").slice(-1)[0],
          dob: formData.dob,
          age: parseInt(formData.age),
          gender: formData.gender,
          address: displayAddress,
          addressCombined,
          // Save separate name fields so backend can persist normalized address parts
          region:
            regions.find((r) => r.region_code === selectedRegion)
              ?.region_name ||
            patientDetails?.region ||
            "",
          province:
            provinces.find((p) => p.province_code === selectedProvince)
              ?.province_name ||
            patientDetails?.province ||
            "",
          city:
            cities.find((c) => c.city_code === selectedCity)?.city_name ||
            patientDetails?.city ||
            "",
          barangay:
            barangays.find((b) => b.brgy_code === selectedBarangay)
              ?.brgy_name ||
            patientDetails?.barangay ||
            "",
          street_subdivision:
            streetAddress || patientDetails?.street_subdivision || "",
          contact: formData.contact,
          occupation: formData.occupation,
          civilStatus: formData.civilStatus,
          referralBy: formData.referralBy,
          ageCategory: formData.ageCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (medicalHistoryId) {
        await axios.put(
          `http://localhost:5000/api/medicalhistory/${medicalHistoryId}`,
          {
            ocularHistory: medicalHistoryData.ocularHistory,
            healthHistory: medicalHistoryData.healthHistory,
            familyMedicalHistory: medicalHistoryData.familyMedicalHistory,
            medications: medicalHistoryData.medications,
            allergies: medicalHistoryData.allergies,
            occupationalHistory: medicalHistoryData.occupationalHistory,
            digitalHistory: medicalHistoryData.digitalHistory,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      alert("Changes saved successfully!");
      setIsEditing(false);
      // Optionally, refetch data or update state
    } catch (error) {
      alert("Failed to save changes. Please try again.");
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      if (!patient || !(patient._id || patient.patientId || patient.id)) return;
      setLoading(true);
      setError(null);
      const id = patient._id || patient.patientId || patient.id;
      const token = localStorage.getItem("token");
      try {
        // Fetch patient profile
        const profileRes = await axios.get(
          `http://localhost:5000/api/profiles/id/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPatientDetails(profileRes.data);
        // Populate formData from profile
        // Backend now stores separate name fields: region, province, city, barangay, street_subdivision
        const regionName = profileRes.data.region || "";
        const provinceName = profileRes.data.province || "";
        const cityName = profileRes.data.city || "";
        const barangayName = profileRes.data.barangay || "";
        const street = profileRes.data.street_subdivision || "";

        // map names back to codes for selects
        const regionObj = regions.find((r) => r.region_name === regionName);
        const regionCode = regionObj?.region_code || "";

        const provinceObj = provinces.find(
          (p) =>
            p.province_name === provinceName &&
            (!regionCode || p.region_code === regionCode)
        );
        const provinceCode = provinceObj?.province_code || "";

        const cityObj = cities.find(
          (c) =>
            c.city_name === cityName &&
            (!provinceCode || c.province_code === provinceCode)
        );
        const cityCode = cityObj?.city_code || "";

        const barangayObj = barangays.find(
          (b) =>
            b.brgy_name === barangayName &&
            (!cityCode || b.city_code === cityCode)
        );
        const barangayCode = barangayObj?.brgy_code || "";

        setSelectedRegion(regionCode);
        setSelectedProvince(provinceCode);
        setSelectedCity(cityCode);
        setSelectedBarangay(barangayCode);
        // Only populate streetAddress from explicit street_subdivision field.
        // Previously we fell back to the whole address string which caused
        // the street input to contain the combined address and resulted in
        // appending that entire string when saving structured address parts.
        setStreetAddress(street || "");

        setFormData({
          fullName: [
            profileRes.data.firstName,
            profileRes.data.middleName,
            profileRes.data.lastName,
          ]
            .filter(Boolean)
            .join(" "),
          dob: profileRes.data.dob || "",
          age: profileRes.data.age || "",
          // prefer the normalized address field
          address:
            profileRes.data.address || profileRes.data.addressCombined || "",
          contact: profileRes.data.contact || "",
          occupation: profileRes.data.occupation || "",
          civilStatus: profileRes.data.civilStatus || "",
          referralBy: profileRes.data.referralBy || "",
          gender: profileRes.data.gender || "",
          ageCategory: profileRes.data.ageCategory || "",
          chiefComplaint: "",
          associatedComplaint: "",
          diagnosis: "",
          treatmentPlan: "",
          visitDate: "",
          doctor: "",
          prescriptions: "",
          notes: "",
        });

        // Fetch medical history
        const medRes = await axios.get(
          `http://localhost:5000/api/medicalhistory/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMedicalHistoryData({
          ocularHistory: medRes.data.ocularHistory || "",
          healthHistory: medRes.data.healthHistory || "",
          familyMedicalHistory: medRes.data.familyMedicalHistory || "",
          medications: medRes.data.medications || "",
          allergies: medRes.data.allergies || "",
          occupationalHistory: medRes.data.occupationalHistory || "",
          digitalHistory: medRes.data.digitalHistory || "",
        });
        setMedicalHistoryId(medRes.data._id);

        // Fetch visit history
        const visitRes = await axios.get(
          `http://localhost:5000/api/visits/patient/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setVisitData(
          (visitRes.data || []).sort(
            (a, b) => new Date(b.visitDate) - new Date(a.visitDate)
          )
        );

        // Optionally, set latest visit details in formData
        if (visitRes.data && visitRes.data.length > 0) {
          const latestVisit = visitRes.data[0];
          setSelectedVisitDate(latestVisit.visitDate); // Set the most recent visit date
          setFormData((prev) => ({
            ...prev,
            chiefComplaint: latestVisit.chiefComplaint || "",
            associatedComplaint: latestVisit.associatedComplaint || "",
            diagnosis: latestVisit.diagnosis || "",
            treatmentPlan: latestVisit.treatmentPlan || "",
            visitDate: latestVisit.visitDate || "",
            doctor: latestVisit.doctor || "",
            prescriptions: latestVisit.prescriptions || "",
            notes: latestVisit.notes || "",
          }));
        }
      } catch (err) {
        setError("Failed to fetch patient data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [patient]);

  // Helper for full name
  const fullName = patientDetails
    ? [
        patientDetails.firstName,
        patientDetails.middleName,
        patientDetails.lastName,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  // --- End fetching logic ---

  // Handler for opening the New Visit modal
  const handleAddNewVisit = () => setShowNewVisitModal(true);
  const handleCloseNewVisitModal = () => setShowNewVisitModal(false);

  // Fetch visit data function
  const fetchVisitData = async () => {
    const id = patient._id || patient.patientId || patient.id;
    const token = localStorage.getItem("token");
    try {
      const visitRes = await axios.get(
        `http://localhost:5000/api/visits/patient/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVisitData(
        (visitRes.data || []).sort(
          (a, b) => new Date(b.visitDate) - new Date(a.visitDate)
        )
      );
      // Optionally update formData with the latest visit
      if (visitRes.data && visitRes.data.length > 0) {
        const latestVisit = visitRes.data[0];
        setSelectedVisitDate(latestVisit.visitDate);
        setFormData((prev) => ({
          ...prev,
          chiefComplaint: latestVisit.chiefComplaint || "",
          associatedComplaint: latestVisit.associatedComplaint || "",
          diagnosis: latestVisit.diagnosis || "",
          treatmentPlan: latestVisit.treatmentPlan || "",
          visitDate: latestVisit.visitDate || "",
          doctor: latestVisit.doctor || "",
          prescriptions: latestVisit.prescriptions || "",
          notes: latestVisit.notes || "",
        }));
      }
    } catch (err) {
      // Optionally handle error
    }
  };

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
                    <p className="font-medium">{patient.dob}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <IoMdCall className="text-deep-red mr-3 text-xl" />
                  <div>
                    <p className="text-gray-600 text-sm">Phone</p>
                    <p className="font-medium">{formData.contact}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <IoMdMail className="text-deep-red mr-3 text-xl" />
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="font-medium">{patient.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <IoMdHome className="text-deep-red mr-3 text-xl" />
                  <div>
                    <p className="text-gray-600 text-sm">Address</p>
                    <p className="font-medium">
                      {patient.address?.display || patient.address || ""}
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
                        value={formData.fullName}
                        onChange={handleChange}
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
                        value={formData.dob ? formData.dob.slice(0, 10) : ""}
                        onChange={handleChange}
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
                        value={formData.age}
                        onChange={handleChange}
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
                        value={formData.ageCategory}
                        onChange={handleChange}
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
                        value={formData.occupation}
                        onChange={handleChange}
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
                        value={formData.contact}
                        onChange={handleChange}
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
                        value={patient.email}
                        onChange={handleChange}
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
                        // Show structured address if available, otherwise show display string
                        <div className="font-medium w-full space-y-1">
                          {selectedRegion ||
                          selectedProvince ||
                          selectedCity ||
                          selectedBarangay ? (
                            <div className="grid grid-cols-1 gap-1">
                              <p>
                                <span className="text-gray-500 text-sm">
                                  Region:{" "}
                                </span>
                                <span>
                                  {selectedRegion
                                    ? regions.find(
                                        (r) => r.region_code === selectedRegion
                                      )?.region_name
                                    : formData.address || ""}
                                </span>
                              </p>
                              <p>
                                <span className="text-gray-500 text-sm">
                                  Province:{" "}
                                </span>
                                <span>
                                  {selectedProvince
                                    ? provinces.find(
                                        (p) =>
                                          p.province_code === selectedProvince
                                      )?.province_name
                                    : ""}
                                </span>
                              </p>
                              <p>
                                <span className="text-gray-500 text-sm">
                                  City:{" "}
                                </span>
                                <span>
                                  {selectedCity
                                    ? cities.find(
                                        (c) => c.city_code === selectedCity
                                      )?.city_name
                                    : ""}
                                </span>
                              </p>
                              <p>
                                <span className="text-gray-500 text-sm">
                                  Barangay:{" "}
                                </span>
                                <span>
                                  {selectedBarangay
                                    ? barangays.find(
                                        (b) => b.brgy_code === selectedBarangay
                                      )?.brgy_name
                                    : ""}
                                </span>
                              </p>
                              <p>
                                <span className="text-gray-500 text-sm">
                                  Street:{" "}
                                </span>
                                <span>{streetAddress || ""}</span>
                              </p>
                            </div>
                          ) : (
                            <p>{formData.address}</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <select
                              value={selectedRegion}
                              onChange={(e) => {
                                setSelectedRegion(e.target.value);
                                setSelectedProvince("");
                                setSelectedCity("");
                                setSelectedBarangay("");
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
                                <option
                                  key={p.province_code}
                                  value={p.province_code}
                                >
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
                              value={selectedBarangay}
                              onChange={(e) =>
                                setSelectedBarangay(e.target.value)
                              }
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
                      )}
                    </div>
                    <div>
                      <label
                        className="text-sm text-gray-600"
                        htmlFor="civilStatus"
                      >
                        Civil Status
                      </label>
                      <input
                        type="text"
                        id="civilStatus"
                        name="civilStatus"
                        value={formData.civilStatus}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="font-medium w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600" htmlFor="gender">
                        Gender
                      </label>
                      <input
                        type="text"
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
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
                        value={formData.referralBy}
                        onChange={handleChange}
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
                    {visitData.length > 0 && (
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
                          {visitData.map((visit) => (
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

                {visitData.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Visit Date</p>
                        <p className="font-medium">
                          {new Date(formData.visitDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Chief Complaint</p>
                        <p className="font-medium">
                          {formData.chiefComplaint || "No Chief Complaint"}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Associated Complaint
                        </p>
                        <p className="font-medium">
                          {formData.associatedComplaint ||
                            "No Associated Complaint"}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Diagnosis</p>
                        <p className="font-medium">
                          {formData.diagnosis || "No Diagnosis"}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Treatment Plan</p>
                        <p className="font-medium">
                          {formData.treatmentPlan ||
                            "No Available Treatment Plan"}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Assigned Doctor</p>
                        <p className="font-medium">{formData.doctor}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Notes</p>
                        <p className="font-medium">
                          {formData.notes || "No notes available"}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">
                          Prescribed Medications
                        </p>
                        <p className="font-medium">{formData.prescriptions}</p>
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
                    {/* Recent Invoices */}
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

                    {/* Payment Summary */}
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
                              .reduce((sum, inv) => sum + inv.subtotal, 0)
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

                    {/* Payment History */}
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
              onClick={() => handleDeletePatient(patient.id)}
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
          patientId={patient._id || patient.patientId || patient.id}
          onClose={handleCloseNewVisitModal}
          onSave={fetchVisitData}
        />
      )}

      {showInvoiceModal && (
        <InvoiceInputModal
          onClose={() => setShowInvoiceModal(false)}
          currentUser={currentUser}
          patientId={patient._id || patient.patientId || patient.id}
        />
      )}
    </div>
  );
};

export default PatientInformationModal;
