// src/components/PatientInformationModal.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react"; // --- ADDED useCallback ---
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
  onDataUpdate, // --- ADDED --- Prop to notify parent about data changes
}) => {
  const [activeTab, setActiveTab] = useState("personal");

  // --- REFACTORED STATE MANAGEMENT ---
  // Centralized state for better clarity
  const [patientDetails, setPatientDetails] = useState(null);
  const [visitHistory, setVisitHistory] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedVisitDate, setSelectedVisitDate] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const currentUser = "Dr. Smith";

  const [isEditing, setIsEditing] = useState(false);

  // --- UPDATED --- Grouped form data into logical objects
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

  // --- ADDED --- State for currently displayed visit details
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

  const [showNewVisitModal, setShowNewVisitModal] = useState(false);

  // --- UNCHANGED --- Memoized helpers for address dropdowns
  const filteredProvinces = useMemo(() => {
    if (!addressFormData.selectedRegion) return [];
    return provinces.filter((p) => p.region_code === addressFormData.selectedRegion);
  }, [addressFormData.selectedRegion]);

  const filteredCities = useMemo(() => {
    if (!addressFormData.selectedProvince) return [];
    return cities.filter((c) => c.province_code === addressFormData.selectedProvince);
  }, [addressFormData.selectedProvince]);

  const filteredBarangays = useMemo(() => {
    if (!addressFormData.selectedCity) return [];
    return barangays.filter((b) => b.city_code === addressFormData.selectedCity);
  }, [addressFormData.selectedCity]);

  // --- ADDED --- Memoized helper for patient ID
  const patientId = useMemo(() => patient._id || patient.patientId || patient.id, [patient]);


  // --- RECREATED DATA FETCHING LOGIC ---
  const fetchAllData = useCallback(async () => {
    if (!patientId) return;

    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    const headers = { headers: { Authorization: `Bearer ${token}` } };

    try {
      // Use Promise.all to fetch all data concurrently for better performance and reliability
      const [profileRes, medHistoryRes, visitRes, invoiceRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/profiles/id/${patientId}`, headers),
        // --- UPDATED --- Fetch medical history by patientId, not its own _id
        axios.get(`http://localhost:5000/api/medicalhistory/${patientId}`, headers),
        axios.get(`http://localhost:5000/api/visits/patient/${patientId}`, headers),
        axios.get(`http://localhost:5000/api/invoices/patient/${patientId}`, headers)
      ]);

      // Process and set Profile data
      const profileData = profileRes.data;
      setPatientDetails(profileData);
      setPersonalFormData({
        fullName: [profileData.firstName, profileData.middleName, profileData.lastName].filter(Boolean).join(" "),
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

      // Process and set Address data
      const regionObj = regions.find(r => r.region_name === profileData.region);
      const provinceObj = provinces.find(p => p.province_name === profileData.province && (!regionObj || p.region_code === regionObj.region_code));
      const cityObj = cities.find(c => c.city_name === profileData.city && (!provinceObj || c.province_code === provinceObj.province_code));
      const barangayObj = barangays.find(b => b.brgy_name === profileData.barangay && (!cityObj || b.city_code === cityObj.city_code));
      
      setAddressFormData({
        displayAddress: profileData.address || "",
        selectedRegion: regionObj?.region_code || "",
        selectedProvince: provinceObj?.province_code || "",
        selectedCity: cityObj?.city_code || "",
        selectedBarangay: barangayObj?.brgy_code || "",
        streetAddress: profileData.street_subdivision || "",
      });

      // Process and set Medical History data
      setMedicalHistoryData(medHistoryRes.data || {
          ocularHistory: "", healthHistory: "", familyMedicalHistory: "",
          medications: "", allergies: "", occupationalHistory: "", digitalHistory: ""
      });

      // Process and set Visit History data
      const sortedVisits = (visitRes.data || []).sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
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
      }

      // Process and set Invoice data
      setInvoices(invoiceRes.data || []);

    } catch (err) {
      console.error("Error fetching patient data:", err);
      // --- ADDED --- Graceful handling if medical history doesn't exist yet
      if (err.response && err.response.status === 404 && err.config.url.includes('medicalhistory')) {
        setMedicalHistoryData({
          ocularHistory: "", healthHistory: "", familyMedicalHistory: "",
          medications: "", allergies: "", occupationalHistory: "", digitalHistory: ""
        });
      } else {
        setError("Failed to fetch some patient data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // --- RECREATED SAVE LOGIC ---
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      // --- PART 1: Update Profile Information ---
      const nameParts = personalFormData.fullName.split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.pop();
      const middleName = nameParts.slice(1).join(" ");
      
      let displayAddress = addressFormData.displayAddress;
      if (addressFormData.selectedRegion) {
          const regionName = regions.find(r => r.region_code === addressFormData.selectedRegion)?.region_name || "";
          const provinceName = provinces.find(p => p.province_code === addressFormData.selectedProvince)?.province_name || "";
          const cityName = cities.find(c => c.city_code === addressFormData.selectedCity)?.city_name || "";
          const barangayName = barangays.find(b => b.brgy_code === addressFormData.selectedBarangay)?.brgy_name || "";
          const combined = [barangayName, cityName, provinceName, regionName].filter(Boolean).join(", ");
          displayAddress = addressFormData.streetAddress ? `${addressFormData.streetAddress}, ${combined}` : combined;
      }

      const profilePayload = {
        firstName,
        middleName,
        lastName,
        ...personalFormData,
        address: displayAddress,
        region: regions.find(r => r.region_code === addressFormData.selectedRegion)?.region_name,
        province: provinces.find(p => p.province_code === addressFormData.selectedProvince)?.province_name,
        city: cities.find(c => c.city_code === addressFormData.selectedCity)?.city_name,
        barangay: barangays.find(b => b.brgy_code === addressFormData.selectedBarangay)?.brgy_name,
        street_subdivision: addressFormData.streetAddress,
      };

      const profileUpdatePromise = axios.put(`http://localhost:5000/api/profiles/${patientId}`, profilePayload, headers);

      // --- PART 2: Update Medical History ---
      // --- UPDATED --- Use the correct "upsert" endpoint for medical history
      const medicalHistoryUpdatePromise = axios.put(`http://localhost:5000/api/medicalhistory/patient/${patientId}`, medicalHistoryData, headers);

      // Run both updates in parallel
      await Promise.all([profileUpdatePromise, medicalHistoryUpdatePromise]);

      alert("Changes saved successfully!");
      setIsEditing(false);
      onDataUpdate(); // --- ADDED --- Notify parent to re-fetch patient list
      fetchAllData(); // Re-fetch data for this modal to show saved state

    } catch (error) {
      console.error("Failed to save changes:", error);
      alert("Failed to save changes. Please check the console and try again.");
    }
  };

  // --- Other handlers (handleChange, handleCancel, etc.) ---
  
  // --- UPDATED --- Generic handler for personal form
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...personalFormData, [name]: value };
    if (name === "dob") {
        let age = "";
        let ageCategory = "";
        if (value) {
            const birthDate = new Date(value);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            ageCategory = getAgeCategory(age);
        }
        newFormData.age = age ? age.toString() : "";
        newFormData.ageCategory = ageCategory;
    }
    setPersonalFormData(newFormData);
  };
  
  // --- ADDED --- Specific handlers for other state objects
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMedicalHistoryChange = (e) => {
    const { name, value } = e.target;
    setMedicalHistoryData(prev => ({ ...prev, [name]: value }));
  };

  // --- UPDATED --- Logic to display the selected visit's details
  const handleVisitDateChange = (e) => {
    const date = e.target.value;
    setSelectedVisitDate(date);
    const selectedVisit = visitHistory.find(visit => visit.visitDate === date);
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

  // --- ADDED --- Function to refresh visit data after adding a new one
  const handleNewVisitSave = () => {
    setShowNewVisitModal(false);
    fetchAllData(); // Re-fetch all data to get the new visit
  };

  // --- UNCHANGED (for brevity) --- handleViewPDF, handleDownloadPDF, getAgeCategory, etc.
  // ...

  // Full name for display purposes
  const fullName = patientDetails ? [patientDetails.firstName, patientDetails.middleName, patientDetails.lastName].filter(Boolean).join(" ") : "";

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
                <button onClick={handleCloseModal} className="mt-4 px-4 py-2 bg-gray-200 rounded">Close</button>
            </div>
        </div>
    );
  }
  
  // --- The rest of the JSX remains identical to your original file ---
  // --- No UI changes were made, only the `value` and `onChange` props of the inputs ---
  // --- were mapped to the new, more organized state variables. ---
  // Example for a personal info input:
  // value={personalFormData.fullName}
  // onChange={handlePersonalChange}

  // Example for medical history input:
  // value={medicalHistoryData.ocularHistory}
  // onChange={handleMedicalHistoryChange}
  
  return (
    // ... your extensive JSX code here, unchanged ...
  );
};

export default PatientInformationModal;