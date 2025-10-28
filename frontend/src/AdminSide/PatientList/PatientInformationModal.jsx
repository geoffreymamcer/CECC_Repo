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
  FaLowVision,
  FaLightbulb,
  FaVial,
  FaClipboardList,
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

  const [caseHistoryData, setCaseHistoryData] = useState({
    chiefComplaint: { others: "" },
    associatedComplaint: { others: "" },
    medicalHistory: { others: "" },
    historyOfChiefComplaint: {},
    historyOfAssociatedComplaint: {},
    familyHistory: { others: "" },
    ocularHistory: {},
    ocularCondition: { others: "" },
    familyOcularCondition: { others: "" },
    occupationalHistory: { details: "" },
    digitalHistory: {},
    eyeglassHistory: {},
  });

  // --- START OF ADDED CODE ---
  const initialClinicalExamState = {
    visualAcuity: {
      chartUsed: "",
      testDistanceUsed: "",
      testDistanceOther: "",
      withoutGlasses: { od: {}, os: {} },
      withGlasses: { od: {}, os: {} },
      dominantEye: { far: {}, near: {} },
    },
    autorefractometer: { od: {}, os: {} },
    autokeratometer: { od: {}, os: {} },
    pdPupilSize: { od: {}, os: {} },
    pupilExamination: { od: {}, os: {} },
    manifestRefraction: { od: {}, os: {} },
    cycloplegicAR: { od: {}, os: {} },
    cycloplegicSubjRefraction: { od: {}, os: {} },
    arkResults: "",
    medsUsed: { type: "", comboTCOthers: "" },
  };

  const initialBinocularTestsState = {
    binocularTests: {
      stereoAcuityLangs: "",
      stereoAcuityCircles: "",
      ocularMotilityVersion: "",
      npc: "",
      w4l6m: "",
      w4l33cm: "",
      maddoxWing: "",
      ct6m: "",
      ct33cm: "",
      angleEst6m: { hirschbergs: "", krimsky: "", pct: "" },
      angleEst33cm: { hirschbergs: "", krimsky: "", pct: "" },
      bagolini33cm: "",
      bagolini6m: "",
      otherTests: "",
    },
    monocularTests: {
      npa: { od: "", os: "" },
      ocularMotilityDuction: { od: "", os: "" },
    },
  };

  const initialSlitLampState = {
    slitLamp: {
      od: {
        lidsLashes: "",
        conjunctiva: "",
        sclera: "",
        cornea: "",
        ac: "",
        iris: "",
        pupil: "",
        lens: "",
        iop: "",
        iopType: "",
        iopTime: "",
      },
      os: {
        lidsLashes: "",
        conjunctiva: "",
        sclera: "",
        cornea: "",
        ac: "",
        iris: "",
        pupil: "",
        lens: "",
        iop: "",
        iopType: "",
        iopTime: "",
      },
    },
    funduscopy: {
      od: {
        retina: "",
        macula: "",
        vessels: "",
        avr: "",
        opticDisc: "",
        cdr: "",
        others: "",
      },
      os: {
        retina: "",
        macula: "",
        vessels: "",
        avr: "",
        opticDisc: "",
        cdr: "",
        others: "",
      },
    },
  };

  const initialDiagnosticPlanState = {
    diagnosticTests: {},
    interpretationOfResults: "",
    assessment: {
      primaryImpression: "",
      secondaryImpression: "",
    },
    planManagement: [
      { od: {}, os: {} },
      { od: {}, os: {} },
    ],
  };
  const initialPlanOfManagementState = {
    slitLampManagement: { od: "", os: "" },
    opticalManagement: {
      finalRx: { od: {}, os: {} },
      frameMeasurements: {},
    },
    contactLensManagement: { finalRx: { od: {}, os: {} } },
    eyeCareSolutions: {},
    therapy: { patching: {} },
    ocularHygiene: {},
    referralAndFollowUp: {},
  };

  const [planOfManagementData, setPlanOfManagementData] = useState(
    initialPlanOfManagementState
  );

  const [diagnosticPlanData, setDiagnosticPlanData] = useState(
    initialDiagnosticPlanState
  );

  const [slitLampData, setSlitLampData] = useState(initialSlitLampState);

  const [basicBinocularTestsData, setBasicBinocularTestsData] = useState(
    initialBinocularTestsState
  );

  const [clinicalExaminationData, setClinicalExaminationData] = useState(
    initialClinicalExamState
  );
  // --- END OF ADDED CODE ---

  // --- START OF DELETED CODE ---
  // The currentVisitDetails state is no longer needed as the tab is being replaced.
  // --- END OF DELETED CODE ---

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
      // --- START OF UPDATED CODE ---
      const caseHistoryPromise = axios
        .get(`http://localhost:5000/api/casehistory/${patientId}`, headers)
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            return { data: null };
          }
          console.error("Error fetching case history:", error);
          throw error;
        });

      const clinicalExamPromise = axios
        .get(
          `http://localhost:5000/api/clinical-examination/${patientId}`,
          headers
        )
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            return { data: null }; // No record exists, which is a valid state
          }
          console.error("Error fetching clinical examination:", error);
          throw error;
        });

      const binocularTestsPromise = axios
        .get(`http://localhost:5000/api/binocular-tests/${patientId}`, headers)
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            return { data: null }; // No record is a valid state
          }
          console.error("Error fetching binocular tests:", error);
          throw error;
        });

      const slitLampPromise = axios
        .get(
          `http://localhost:5000/api/slit-lamp-funduscopy/${patientId}`,
          headers
        )
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            return { data: null }; // No record is a valid state
          }
          console.error("Error fetching slit lamp data:", error);
          throw error;
        });

      const diagnosticPlanPromise = axios
        .get(
          `http://localhost:5000/api/diagnostic-assessment-plan/${patientId}`,
          headers
        )
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            return { data: null }; // No record is a valid state
          }
          console.error("Error fetching diagnostic plan:", error);
          throw error;
        });

      const planOfManagementPromise = axios
        .get(
          `http://localhost:5000/api/plan-of-management/${patientId}`,
          headers
        )
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            return { data: null }; // No record is a valid state
          }
          console.error("Error fetching plan of management:", error);
          throw error;
        });

      const [
        profileRes,
        caseHistoryRes,
        clinicalExamRes,
        binocularTestsRes,
        slitLampRes,
        diagnosticPlanRes,
        planOfManagementRes,
        visitRes,
        invoiceRes,
      ] = await Promise.all([
        axios.get(
          `http://localhost:5000/api/profiles/id/${patientId}`,
          headers
        ),
        caseHistoryPromise,
        clinicalExamPromise,
        binocularTestsPromise,
        slitLampPromise,
        diagnosticPlanPromise,
        planOfManagementPromise,
        axios.get(
          `http://localhost:5000/api/visits/patient/${patientId}`,
          headers
        ),
        axios.get(
          `http://localhost:5000/api/invoices/patient/${patientId}`,
          headers
        ),
      ]);
      // --- END OF UPDATED CODE ---

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

      // Case history
      if (caseHistoryRes && caseHistoryRes.data) {
        setCaseHistoryData(caseHistoryRes.data);
      } else {
        setCaseHistoryData({
          chiefComplaint: { others: "" },
          associatedComplaint: { others: "" },
          medicalHistory: { others: "" },
          historyOfChiefComplaint: {},
          historyOfAssociatedComplaint: {},
          familyHistory: { others: "" },
          ocularHistory: {},
          ocularCondition: { others: "" },
          familyOcularCondition: { others: "" },
          occupationalHistory: { details: "" },
          digitalHistory: {},
          eyeglassHistory: {},
        });
      }

      if (clinicalExamRes && clinicalExamRes.data) {
        setClinicalExaminationData(clinicalExamRes.data);
      } else {
        setClinicalExaminationData(initialClinicalExamState);
      }

      if (binocularTestsRes && binocularTestsRes.data) {
        setBasicBinocularTestsData(binocularTestsRes.data);
      } else {
        setBasicBinocularTestsData(initialBinocularTestsState);
      }

      if (slitLampRes && slitLampRes.data) {
        setSlitLampData(slitLampRes.data);
      } else {
        setSlitLampData(initialSlitLampState);
      }

      if (diagnosticPlanRes && diagnosticPlanRes.data) {
        setDiagnosticPlanData(diagnosticPlanRes.data);
      } else {
        setDiagnosticPlanData(initialDiagnosticPlanState);
      }

      if (planOfManagementRes && planOfManagementRes.data) {
        setPlanOfManagementData(planOfManagementRes.data);
      } else {
        setPlanOfManagementData(initialPlanOfManagementState);
      }

      const sortedVisits = (visitRes.data || []).sort(
        (a, b) => new Date(b.visitDate) - new Date(a.visitDate)
      );
      setVisitHistory(sortedVisits);
      if (sortedVisits.length > 0) {
        setSelectedVisitDate(sortedVisits[0].visitDate);
      } else {
        setSelectedVisitDate("");
      }
      // --- END OF UPDATED CODE ---

      // Invoices
      setInvoices(invoiceRes.data || []);
    } catch (err) {
      console.error("Error fetching patient data:", err);
      setError("Failed to fetch patient data.");
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

  const handleCaseHistoryChange = (e) => {
    const { name, value, type, checked } = e.target;
    const [section, field] = name.split(".");

    setCaseHistoryData((prev) => {
      const newSection = { ...prev[section] };
      newSection[field] = type === "checkbox" ? checked : value;
      return { ...prev, [section]: newSection };
    });
  };

  // --- START OF ADDED CODE ---
  const handleClinicalExaminationChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split("."); // e.g., 'visualAcuity.withoutGlasses.od.sc'

    setClinicalExaminationData((prev) => {
      const newState = JSON.parse(JSON.stringify(prev)); // Deep copy to avoid mutation
      let current = newState;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = current[keys[i]] || {};
      }

      current[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  const handleBinocularTestsChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split("."); // e.g., 'binocularTests.angleEst6m.hirschbergs'

    setBasicBinocularTestsData((prev) => {
      const newState = JSON.parse(JSON.stringify(prev)); // Deep copy for safety
      let current = newState;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = current[keys[i]] || {};
      }

      current[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  const handleSlitLampChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split("."); // e.g., 'slitLamp.od.lidsLashes'

    setSlitLampData((prev) => {
      const newState = JSON.parse(JSON.stringify(prev)); // Deep copy
      let current = newState;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = current[keys[i]] || {};
      }

      current[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  const handleDiagnosticPlanChange = (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split(".");

    setDiagnosticPlanData((prev) => {
      const newState = JSON.parse(JSON.stringify(prev));
      let current = newState;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = current[keys[i]] || {};
      }

      current[keys[keys.length - 1]] = type === "checkbox" ? checked : value;
      return newState;
    });
  };

  const handlePlanOfManagementChange = (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split(".");

    setPlanOfManagementData((prev) => {
      const newState = JSON.parse(JSON.stringify(prev));
      let current = newState;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = current[keys[i]] || {};
      }

      current[keys[keys.length - 1]] = type === "checkbox" ? checked : value;
      return newState;
    });
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
    fetchAllData(); // Re-fetch original data to discard changes
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

      // Upsert case history for patient
      const caseHistoryUpdatePromise = axios.put(
        `http://localhost:5000/api/casehistory/${patientId}`,
        caseHistoryData,
        headers
      );

      const clinicalExamUpdatePromise = axios.put(
        `http://localhost:5000/api/clinicalexamination/${patientId}`,
        clinicalExaminationData,
        headers
      );

      const binocularTestsUpdatePromise = axios.put(
        `http://localhost:5000/api/binocular-tests/${patientId}`,
        basicBinocularTestsData,
        headers
      );

      const slitLampUpdatePromise = axios.put(
        `http://localhost:5000/api/slit-lamp-funduscopy/${patientId}`,
        slitLampData,
        headers
      );

      const diagnosticPlanUpdatePromise = axios.put(
        `http://localhost:5000/api/diagnostic-assessment-plan/${patientId}`,
        diagnosticPlanData,
        headers
      );

      const planOfManagementUpdatePromise = axios.put(
        `http://localhost:5000/api/plan-of-management/${patientId}`,
        planOfManagementData,
        headers
      );

      await Promise.all([
        profileUpdatePromise,
        caseHistoryUpdatePromise,
        clinicalExamUpdatePromise,
        binocularTestsUpdatePromise,
        slitLampUpdatePromise,
        diagnosticPlanUpdatePromise,
        planOfManagementUpdatePromise,
      ]);
      // --- END OF ADDED CODE ---

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

  const isCaseHistoryEmpty = !Object.values(caseHistoryData).some((section) =>
    typeof section === "object" && section !== null
      ? Object.values(section).some((value) => value)
      : section
  );

  // --- START OF ADDED CODE ---
  // Helper to safely get nested values for form inputs
  const getNestedValue = (obj, path) => {
    if (!path) return "";
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const isClinicalExamEmpty = !Object.values(clinicalExaminationData).some(
    (section) =>
      typeof section === "object" && section !== null
        ? Object.values(section).some(
            (value) =>
              (typeof value === "object" &&
                value !== null &&
                Object.values(value).length > 0) ||
              (typeof value !== "object" && value)
          )
        : section
  );

  const isBinocularTestsEmpty =
    !basicBinocularTestsData ||
    (Object.keys(basicBinocularTestsData.binocularTests).every(
      (key) => !basicBinocularTestsData.binocularTests[key]
    ) &&
      Object.keys(basicBinocularTestsData.monocularTests).every(
        (key) => !basicBinocularTestsData.monocularTests[key]
      ));

  const isSlitLampEmpty =
    !slitLampData ||
    (Object.keys(slitLampData.slitLamp.od).every(
      (key) => !slitLampData.slitLamp.od[key]
    ) &&
      Object.keys(slitLampData.slitLamp.os).every(
        (key) => !slitLampData.slitLamp.os[key]
      ) &&
      Object.keys(slitLampData.funduscopy.od).every(
        (key) => !slitLampData.funduscopy.od[key]
      ) &&
      Object.keys(slitLampData.funduscopy.os).every(
        (key) => !slitLampData.funduscopy.os[key]
      ));

  const isDiagnosticPlanEmpty =
    !diagnosticPlanData ||
    (Object.keys(diagnosticPlanData.diagnosticTests).every(
      (key) => !diagnosticPlanData.diagnosticTests[key]
    ) &&
      !diagnosticPlanData.interpretationOfResults &&
      !diagnosticPlanData.assessment.primaryImpression &&
      !diagnosticPlanData.assessment.secondaryImpression);

  const isPlanOfManagementEmpty =
    !planOfManagementData ||
    Object.values(planOfManagementData).every((section) => {
      if (typeof section === "object" && section !== null) {
        return Object.values(section).every((value) => !value);
      }
      return !section;
    });

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

  const CaseHistoryInput = ({ section, field, label }) => (
    <div>
      <label
        className="text-sm text-gray-600 mb-1 block"
        htmlFor={`${section}.${field}`}
      >
        {label}
      </label>
      <input
        type="text"
        id={`${section}.${field}`}
        name={`${section}.${field}`}
        value={caseHistoryData?.[section]?.[field] || ""}
        onChange={handleCaseHistoryChange}
        disabled={!isEditing}
        className="font-medium w-full p-2 border border-gray-200 rounded-md"
      />
    </div>
  );

  // --- START OF ADDED CODE ---
  const ClinicalExamInput = ({ name, label, placeholder }) => (
    <div>
      <label className="text-sm text-gray-600 mb-1 block" htmlFor={name}>
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={getNestedValue(clinicalExaminationData, name) || ""}
        onChange={handleClinicalExaminationChange}
        disabled={!isEditing}
        className="font-medium w-full p-2 border border-gray-200 rounded-md"
        placeholder={placeholder}
      />
    </div>
  );

  const BinocularTestInput = ({ name, label, placeholder }) => (
    <div>
      <label className="text-sm text-gray-600 mb-1 block" htmlFor={name}>
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={getNestedValue(basicBinocularTestsData, name) || ""}
        onChange={handleBinocularTestsChange}
        disabled={!isEditing}
        className="font-medium w-full p-2 border border-gray-200 rounded-md"
        placeholder={placeholder}
      />
    </div>
  );

  const SlitLampInput = ({ name, label, placeholder }) => (
    <div>
      <label className="text-sm text-gray-600 mb-1 block" htmlFor={name}>
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={getNestedValue(slitLampData, name) || ""}
        onChange={handleSlitLampChange}
        disabled={!isEditing}
        className="font-medium w-full p-2 border border-gray-200 rounded-md"
        placeholder={placeholder}
      />
    </div>
  );

  const DiagnosticPlanInput = ({ name, label, placeholder }) => (
    <div>
      <label className="text-sm text-gray-600 mb-1 block" htmlFor={name}>
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={getNestedValue(diagnosticPlanData, name) || ""}
        onChange={handleDiagnosticPlanChange}
        disabled={!isEditing}
        className="font-medium w-full p-2 border border-gray-200 rounded-md"
        placeholder={placeholder}
      />
    </div>
  );

  const PlanOfManagementInput = ({ name, label, placeholder }) => (
    <div>
      <label className="text-sm text-gray-600 mb-1 block" htmlFor={name}>
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={getNestedValue(planOfManagementData, name) || ""}
        onChange={handlePlanOfManagementChange}
        disabled={!isEditing}
        className="font-medium w-full p-2 border border-gray-200 rounded-md"
        placeholder={placeholder}
      />
    </div>
  );

  const PlanOfManagementCheckbox = ({ name, label }) => (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={!!getNestedValue(planOfManagementData, name)}
        onChange={handlePlanOfManagementChange}
        disabled={!isEditing}
        className="h-4 w-4 rounded border-gray-300 text-deep-red focus:ring-deep-red"
      />
      <label htmlFor={name} className="ml-2 text-gray-700">
        {label}
      </label>
    </div>
  );

  const DiagnosticPlanCheckbox = ({ name, label }) => (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={!!getNestedValue(diagnosticPlanData, name)}
        onChange={handleDiagnosticPlanChange}
        disabled={!isEditing}
        className="h-4 w-4 rounded border-gray-300 text-deep-red focus:ring-deep-red"
      />
      <label htmlFor={name} className="ml-2 text-gray-700">
        {label}
      </label>
    </div>
  );

  const CaseHistoryCheckbox = ({ section, field, label }) => (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={`${section}.${field}`}
        name={`${section}.${field}`}
        checked={!!caseHistoryData?.[section]?.[field]}
        onChange={handleCaseHistoryChange}
        disabled={!isEditing}
        className="h-4 w-4 rounded border-gray-300 text-deep-red focus:ring-deep-red"
      />
      <label htmlFor={`${section}.${field}`} className="ml-2 text-gray-700">
        {label}
      </label>
    </div>
  );

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
                  activeTab === "caseHistory"
                    ? "text-deep-red border-b-2 border-deep-red"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("caseHistory")}
              >
                Case History
              </button>
              <button
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === "clinicalExamination"
                    ? "text-deep-red border-b-2 border-deep-red"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("clinicalExamination")}
              >
                Clinical Examination
              </button>
              <button
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === "binocularTests"
                    ? "text-deep-red border-b-2 border-deep-red"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("binocularTests")}
              >
                Binocular Tests
              </button>
              <button
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === "slitLamp"
                    ? "text-deep-red border-b-2 border-deep-red"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("slitLamp")}
              >
                Slit Lamp
              </button>

              <button
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === "diagnosticPlan"
                    ? "text-deep-red border-b-2 border-deep-red"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("diagnosticPlan")}
              >
                Diagnostic Plan
              </button>

              <button
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === "planOfManagement"
                    ? "text-deep-red border-b-2 border-deep-red"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("planOfManagement")}
              >
                Plan of Management
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

            {activeTab === "caseHistory" && (
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                  <FaNotesMedical className="mr-2 text-deep-red" />
                  Case History Taking
                </h4>
                {isCaseHistoryEmpty && !isEditing ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 italic">
                      No case history records found for this patient.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Chief Complaint */}
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-3">Chief Complaint</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <CaseHistoryCheckbox
                          section="chiefComplaint"
                          field="blurring"
                          label="Blurring"
                        />
                        <CaseHistoryCheckbox
                          section="chiefComplaint"
                          field="headache"
                          label="Headache"
                        />
                        <CaseHistoryCheckbox
                          section="chiefComplaint"
                          field="doubleVision"
                          label="Double Vision"
                        />
                        <CaseHistoryCheckbox
                          section="chiefComplaint"
                          field="photophobia"
                          label="Photophobia"
                        />
                        <CaseHistoryCheckbox
                          section="chiefComplaint"
                          field="itchyEyes"
                          label="Itchy Eyes"
                        />
                        <CaseHistoryCheckbox
                          section="chiefComplaint"
                          field="eyeRedness"
                          label="Eye Redness"
                        />
                        <CaseHistoryCheckbox
                          section="chiefComplaint"
                          field="eyePain"
                          label="Eye Pain"
                        />
                      </div>
                      <div className="mt-4">
                        <CaseHistoryInput
                          section="chiefComplaint"
                          field="others"
                          label="Others"
                        />
                      </div>
                    </div>

                    {/* Medical History */}
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-3">Medical History</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <CaseHistoryCheckbox
                          section="medicalHistory"
                          field="hypertension"
                          label="Hypertension"
                        />
                        <CaseHistoryCheckbox
                          section="medicalHistory"
                          field="cardiovascular"
                          label="Cardiovascular"
                        />
                        <CaseHistoryCheckbox
                          section="medicalHistory"
                          field="diabetes"
                          label="Diabetes"
                        />
                        <CaseHistoryCheckbox
                          section="medicalHistory"
                          field="asthma"
                          label="Asthma"
                        />
                        <CaseHistoryCheckbox
                          section="medicalHistory"
                          field="allergies"
                          label="Allergies"
                        />
                        <CaseHistoryCheckbox
                          section="medicalHistory"
                          field="congenital"
                          label="Congenital"
                        />
                        <CaseHistoryCheckbox
                          section="medicalHistory"
                          field="majorSurgery"
                          label="Major Surgery"
                        />
                      </div>
                      <div className="mt-4">
                        <CaseHistoryInput
                          section="medicalHistory"
                          field="others"
                          label="Others"
                        />
                      </div>
                    </div>

                    {/* Ocular History */}
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-3">Ocular History</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CaseHistoryInput
                          section="ocularHistory"
                          field="spectacleRx"
                          label="Spectacle Rx"
                        />
                        <CaseHistoryInput
                          section="ocularHistory"
                          field="spectacleYear"
                          label="Spectacle Year"
                        />
                        <CaseHistoryInput
                          section="ocularHistory"
                          field="contactLens"
                          label="Contact Lens"
                        />
                        <CaseHistoryInput
                          section="ocularHistory"
                          field="eyeSurgery"
                          label="Eye Surgery"
                        />
                        <CaseHistoryInput
                          section="ocularHistory"
                          field="systemicSurgery"
                          label="Systemic Surgery"
                        />
                      </div>
                    </div>

                    {/* Digital History */}
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-3">Digital History</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CaseHistoryInput
                          section="digitalHistory"
                          field="cellphone"
                          label="Cellphone Usage"
                        />
                        <CaseHistoryInput
                          section="digitalHistory"
                          field="laptop"
                          label="Laptop Usage"
                        />
                        <CaseHistoryInput
                          section="digitalHistory"
                          field="desktop"
                          label="Desktop Usage"
                        />
                        <CaseHistoryInput
                          section="digitalHistory"
                          field="television"
                          label="Television Usage"
                        />
                        <CaseHistoryInput
                          section="digitalHistory"
                          field="work"
                          label="Work Related"
                        />
                        <CaseHistoryInput
                          section="digitalHistory"
                          field="hobbies"
                          label="Hobbies"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- START OF REPLACEMENT CODE BLOCK --- */}
            {activeTab === "clinicalExamination" && (
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                  <FaEye className="mr-2 text-deep-red" />
                  Clinical Examination
                </h4>
                {isClinicalExamEmpty && !isEditing ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 italic">
                      No clinical examination records found for this patient.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Visual Acuity */}
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-3">Visual Acuity</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <ClinicalExamInput
                          name="visualAcuity.chartUsed"
                          label="Chart Used"
                        />
                        <ClinicalExamInput
                          name="visualAcuity.testDistanceUsed"
                          label="Test Distance Used"
                        />
                        <ClinicalExamInput
                          name="visualAcuity.testDistanceOther"
                          label="Other"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                          <h6 className="font-medium text-gray-700 mb-2 border-b pb-1">
                            Without Glasses
                          </h6>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-semibold text-center mb-1">
                                OD
                              </p>
                              <ClinicalExamInput
                                name="visualAcuity.withoutGlasses.od.sc"
                                label="SC"
                              />
                              <ClinicalExamInput
                                name="visualAcuity.withoutGlasses.od.ph"
                                label="PH"
                              />
                              <ClinicalExamInput
                                name="visualAcuity.withoutGlasses.od.near"
                                label="Near"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-center mb-1">
                                OS
                              </p>
                              <ClinicalExamInput
                                name="visualAcuity.withoutGlasses.os.sc"
                                label="SC"
                              />
                              <ClinicalExamInput
                                name="visualAcuity.withoutGlasses.os.ph"
                                label="PH"
                              />
                              <ClinicalExamInput
                                name="visualAcuity.withoutGlasses.os.near"
                                label="Near"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium text-gray-700 mb-2 border-b pb-1">
                            With Glasses
                          </h6>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-semibold text-center mb-1">
                                OD
                              </p>
                              <ClinicalExamInput
                                name="visualAcuity.withGlasses.od.sc"
                                label="SC"
                              />
                              <ClinicalExamInput
                                name="visualAcuity.withGlasses.od.ph"
                                label="PH"
                              />
                              <ClinicalExamInput
                                name="visualAcuity.withGlasses.od.near"
                                label="Near"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-center mb-1">
                                OS
                              </p>
                              <ClinicalExamInput
                                name="visualAcuity.withGlasses.os.sc"
                                label="SC"
                              />
                              <ClinicalExamInput
                                name="visualAcuity.withGlasses.os.ph"
                                label="PH"
                              />
                              <ClinicalExamInput
                                name="visualAcuity.withGlasses.os.near"
                                label="Near"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Autorefractometer */}
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-3">Autorefractometer</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h6 className="font-medium text-gray-700 mb-2">
                            OD (Right Eye)
                          </h6>
                          <div className="space-y-2">
                            <ClinicalExamInput
                              name="autorefractometer.od.sphere"
                              label="Sphere"
                            />
                            <ClinicalExamInput
                              name="autorefractometer.od.cylinder"
                              label="Cylinder"
                            />
                            <ClinicalExamInput
                              name="autorefractometer.od.axis"
                              label="Axis"
                            />
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium text-gray-700 mb-2">
                            OS (Left Eye)
                          </h6>
                          <div className="space-y-2">
                            <ClinicalExamInput
                              name="autorefractometer.os.sphere"
                              label="Sphere"
                            />
                            <ClinicalExamInput
                              name="autorefractometer.os.cylinder"
                              label="Cylinder"
                            />
                            <ClinicalExamInput
                              name="autorefractometer.os.axis"
                              label="Axis"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Manifest Refraction */}
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-3">
                        Manifest Refraction
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h6 className="font-medium text-gray-700 mb-2">
                            OD (Right Eye)
                          </h6>
                          <div className="space-y-2">
                            <ClinicalExamInput
                              name="manifestRefraction.od.sphere"
                              label="Sphere"
                            />
                            <ClinicalExamInput
                              name="manifestRefraction.od.cylinder"
                              label="Cylinder"
                            />
                            <ClinicalExamInput
                              name="manifestRefraction.od.axis"
                              label="Axis"
                            />
                            <ClinicalExamInput
                              name="manifestRefraction.od.va"
                              label="VA"
                            />
                            <ClinicalExamInput
                              name="manifestRefraction.od.add"
                              label="ADD"
                            />
                            <ClinicalExamInput
                              name="manifestRefraction.od.nva"
                              label="NVA"
                            />
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium text-gray-700 mb-2">
                            OS (Left Eye)
                          </h6>
                          <div className="space-y-2">
                            <ClinicalExamInput
                              name="manifestRefraction.os.sphere"
                              label="Sphere"
                            />
                            <ClinicalExamInput
                              name="manifestRefraction.os.cylinder"
                              label="Cylinder"
                            />
                            <ClinicalExamInput
                              name="manifestRefraction.os.axis"
                              label="Axis"
                            />
                            <ClinicalExamInput
                              name="manifestRefraction.os.va"
                              label="VA"
                            />
                            <ClinicalExamInput
                              name="manifestRefraction.os.add"
                              label="ADD"
                            />
                            <ClinicalExamInput
                              name="manifestRefraction.os.nva"
                              label="NVA"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "binocularTests" && (
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                  <FaLowVision className="mr-2 text-deep-red" />
                  Basic Binocular Vision Tests
                </h4>
                {isBinocularTestsEmpty && !isEditing ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 italic">
                      No binocular vision test records found for this patient.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Binocular Tests */}
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-3">Binocular Tests</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <BinocularTestInput
                          name="binocularTests.stereoAcuityLangs"
                          label="Stereo Acuity (Langs)"
                        />
                        <BinocularTestInput
                          name="binocularTests.stereoAcuityCircles"
                          label="Stereo Acuity (Circles)"
                        />
                        <BinocularTestInput
                          name="binocularTests.ocularMotilityVersion"
                          label="Ocular Motility (Version)"
                        />
                        <BinocularTestInput
                          name="binocularTests.npc"
                          label="NPC"
                        />
                        <BinocularTestInput
                          name="binocularTests.w4l6m"
                          label="W4L (6m)"
                        />
                        <BinocularTestInput
                          name="binocularTests.w4l33cm"
                          label="W4L (33cm)"
                        />
                        <BinocularTestInput
                          name="binocularTests.maddoxWing"
                          label="Maddox Wing"
                        />
                        <BinocularTestInput
                          name="binocularTests.ct6m"
                          label="CT (6m)"
                        />
                        <BinocularTestInput
                          name="binocularTests.ct33cm"
                          label="CT (33cm)"
                        />
                        <BinocularTestInput
                          name="binocularTests.bagolini33cm"
                          label="Bagolini (33cm)"
                        />
                        <BinocularTestInput
                          name="binocularTests.bagolini6m"
                          label="Bagolini (6m)"
                        />
                        <BinocularTestInput
                          name="binocularTests.otherTests"
                          label="Other Tests"
                        />
                      </div>
                    </div>

                    {/* Angle Estimation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-semibold mb-3">
                          Angle Estimation (6m)
                        </h5>
                        <div className="space-y-2">
                          <BinocularTestInput
                            name="binocularTests.angleEst6m.hirschbergs"
                            label="Hirschberg's"
                          />
                          <BinocularTestInput
                            name="binocularTests.angleEst6m.krimsky"
                            label="Krimsky"
                          />
                          <BinocularTestInput
                            name="binocularTests.angleEst6m.pct"
                            label="PCT"
                          />
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-semibold mb-3">
                          Angle Estimation (33cm)
                        </h5>
                        <div className="space-y-2">
                          <BinocularTestInput
                            name="binocularTests.angleEst33cm.hirschbergs"
                            label="Hirschberg's"
                          />
                          <BinocularTestInput
                            name="binocularTests.angleEst33cm.krimsky"
                            label="Krimsky"
                          />
                          <BinocularTestInput
                            name="binocularTests.angleEst33cm.pct"
                            label="PCT"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Monocular Tests */}
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-3">Monocular Tests</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h6 className="font-medium text-gray-700 mb-2">
                            NPA
                          </h6>
                          <div className="grid grid-cols-2 gap-4">
                            <BinocularTestInput
                              name="monocularTests.npa.od"
                              label="OD"
                            />
                            <BinocularTestInput
                              name="monocularTests.npa.os"
                              label="OS"
                            />
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium text-gray-700 mb-2">
                            Ocular Motility (Duction)
                          </h6>
                          <div className="grid grid-cols-2 gap-4">
                            <BinocularTestInput
                              name="monocularTests.ocularMotilityDuction.od"
                              label="OD"
                            />
                            <BinocularTestInput
                              name="monocularTests.ocularMotilityDuction.os"
                              label="OS"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "slitLamp" && (
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                  <FaLightbulb className="mr-2 text-deep-red" />
                  Slit Lamp & Funduscopy
                </h4>
                {isSlitLampEmpty && !isEditing ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 italic">
                      No slit lamp or funduscopy records found for this patient.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Slit Lamp Examination */}
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-semibold mb-3">
                          Slit Lamp Examination
                        </h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h6 className="font-medium text-center text-gray-700 mb-2">
                              OD
                            </h6>
                            <SlitLampInput
                              name="slitLamp.od.lidsLashes"
                              label="Lids/Lashes"
                            />
                            <SlitLampInput
                              name="slitLamp.od.conjunctiva"
                              label="Conjunctiva"
                            />
                            <SlitLampInput
                              name="slitLamp.od.sclera"
                              label="Sclera"
                            />
                            <SlitLampInput
                              name="slitLamp.od.cornea"
                              label="Cornea"
                            />
                            <SlitLampInput name="slitLamp.od.ac" label="A/C" />
                            <SlitLampInput
                              name="slitLamp.od.iris"
                              label="Iris"
                            />
                            <SlitLampInput
                              name="slitLamp.od.pupil"
                              label="Pupil"
                            />
                            <SlitLampInput
                              name="slitLamp.od.lens"
                              label="Lens"
                            />
                            <SlitLampInput name="slitLamp.od.iop" label="IOP" />
                            <SlitLampInput
                              name="slitLamp.od.iopType"
                              label="IOP Type"
                            />
                            <SlitLampInput
                              name="slitLamp.od.iopTime"
                              label="IOP Time"
                            />
                          </div>
                          <div>
                            <h6 className="font-medium text-center text-gray-700 mb-2">
                              OS
                            </h6>
                            <SlitLampInput
                              name="slitLamp.os.lidsLashes"
                              label="Lids/Lashes"
                            />
                            <SlitLampInput
                              name="slitLamp.os.conjunctiva"
                              label="Conjunctiva"
                            />
                            <SlitLampInput
                              name="slitLamp.os.sclera"
                              label="Sclera"
                            />
                            <SlitLampInput
                              name="slitLamp.os.cornea"
                              label="Cornea"
                            />
                            <SlitLampInput name="slitLamp.os.ac" label="A/C" />
                            <SlitLampInput
                              name="slitLamp.os.iris"
                              label="Iris"
                            />
                            <SlitLampInput
                              name="slitLamp.os.pupil"
                              label="Pupil"
                            />
                            <SlitLampInput
                              name="slitLamp.os.lens"
                              label="Lens"
                            />
                            <SlitLampInput name="slitLamp.os.iop" label="IOP" />
                            <SlitLampInput
                              name="slitLamp.os.iopType"
                              label="IOP Type"
                            />
                            <SlitLampInput
                              name="slitLamp.os.iopTime"
                              label="IOP Time"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Funduscopy Examination */}
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-semibold mb-3">
                          Funduscopy Examination
                        </h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h6 className="font-medium text-center text-gray-700 mb-2">
                              OD
                            </h6>
                            <SlitLampInput
                              name="funduscopy.od.retina"
                              label="Retina"
                            />
                            <SlitLampInput
                              name="funduscopy.od.macula"
                              label="Macula"
                            />
                            <SlitLampInput
                              name="funduscopy.od.vessels"
                              label="Vessels"
                            />
                            <SlitLampInput
                              name="funduscopy.od.avr"
                              label="A/V-R"
                            />
                            <SlitLampInput
                              name="funduscopy.od.opticDisc"
                              label="Optic Disc"
                            />
                            <SlitLampInput
                              name="funduscopy.od.cdr"
                              label="C/D-R"
                            />
                            <SlitLampInput
                              name="funduscopy.od.others"
                              label="Others"
                            />
                          </div>
                          <div>
                            <h6 className="font-medium text-center text-gray-700 mb-2">
                              OS
                            </h6>
                            <SlitLampInput
                              name="funduscopy.os.retina"
                              label="Retina"
                            />
                            <SlitLampInput
                              name="funduscopy.os.macula"
                              label="Macula"
                            />
                            <SlitLampInput
                              name="funduscopy.os.vessels"
                              label="Vessels"
                            />
                            <SlitLampInput
                              name="funduscopy.os.avr"
                              label="A/V-R"
                            />
                            <SlitLampInput
                              name="funduscopy.os.opticDisc"
                              label="Optic Disc"
                            />
                            <SlitLampInput
                              name="funduscopy.os.cdr"
                              label="C/D-R"
                            />
                            <SlitLampInput
                              name="funduscopy.os.others"
                              label="Others"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "diagnosticPlan" && (
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                  <FaVial className="mr-2 text-deep-red" />
                  Diagnostic Tests & Assessment
                </h4>
                {isDiagnosticPlanEmpty && !isEditing ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 italic">
                      No diagnostic plan records found for this patient.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-3">Diagnostic Tests</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <DiagnosticPlanCheckbox
                          name="diagnosticTests.aberrometry"
                          label="Aberrometry"
                        />
                        <DiagnosticPlanCheckbox
                          name="diagnosticTests.cornealTopography"
                          label="Corneal Topography"
                        />
                        <DiagnosticPlanCheckbox
                          name="diagnosticTests.pachymetry"
                          label="Pachymetry"
                        />
                        <DiagnosticPlanCheckbox
                          name="diagnosticTests.biometry"
                          label="Biometry"
                        />
                        <DiagnosticPlanCheckbox
                          name="diagnosticTests.visualField"
                          label="Visual Field"
                        />
                        <DiagnosticPlanCheckbox
                          name="diagnosticTests.glareAndContrast"
                          label="Glare & Contrast"
                        />
                        <DiagnosticPlanCheckbox
                          name="diagnosticTests.fundusPhoto"
                          label="Fundus Photo"
                        />
                        <DiagnosticPlanCheckbox
                          name="diagnosticTests.anteriorOct"
                          label="Anterior OCT"
                        />
                        <DiagnosticPlanCheckbox
                          name="diagnosticTests.posteriorOct"
                          label="Posterior OCT"
                        />
                        <DiagnosticPlanCheckbox
                          name="diagnosticTests.nerveFiberAnalyzer"
                          label="Nerve Fiber Analyzer"
                        />
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-3">
                        Interpretation of Results
                      </h5>
                      <textarea
                        name="interpretationOfResults"
                        value={diagnosticPlanData.interpretationOfResults}
                        onChange={handleDiagnosticPlanChange}
                        disabled={!isEditing}
                        className="font-medium w-full p-2 border border-gray-200 rounded-md"
                        rows="4"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-semibold mb-3">Assessment</h5>
                        <DiagnosticPlanInput
                          name="assessment.primaryImpression"
                          label="Primary Impression"
                        />
                        <DiagnosticPlanInput
                          name="assessment.secondaryImpression"
                          label="Secondary Impression"
                        />
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h5 className="font-semibold mb-3">Plan Management</h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h6 className="font-medium text-center text-gray-700 mb-2">
                              OD
                            </h6>
                            <DiagnosticPlanInput
                              name="planManagement.0.od.meds"
                              label="Meds"
                            />
                            <DiagnosticPlanInput
                              name="planManagement.0.od.quantity"
                              label="Quantity"
                            />
                          </div>
                          <div>
                            <h6 className="font-medium text-center text-gray-700 mb-2">
                              OS
                            </h6>
                            <DiagnosticPlanInput
                              name="planManagement.0.os.meds"
                              label="Meds"
                            />
                            <DiagnosticPlanInput
                              name="planManagement.0.os.quantity"
                              label="Quantity"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "planOfManagement" && (
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                  <FaClipboardList className="mr-2 text-deep-red" />
                  Plan of Management
                </h4>
                {isPlanOfManagementEmpty && !isEditing ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 italic">
                      No plan of management records found for this patient.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-3">
                        Slit Lamp Management
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PlanOfManagementInput
                          name="slitLampManagement.od"
                          label="OD"
                        />
                        <PlanOfManagementInput
                          name="slitLampManagement.os"
                          label="OS"
                        />
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-3">Optical Management</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h6 className="font-medium text-gray-700 mb-2">
                            Final Rx (OD)
                          </h6>
                          <PlanOfManagementInput
                            name="opticalManagement.finalRx.od.sphere"
                            label="Sphere"
                          />
                          <PlanOfManagementInput
                            name="opticalManagement.finalRx.od.cylinder"
                            label="Cylinder"
                          />
                          <PlanOfManagementInput
                            name="opticalManagement.finalRx.od.axis"
                            label="Axis"
                          />
                        </div>
                        <div>
                          <h6 className="font-medium text-gray-700 mb-2">
                            Final Rx (OS)
                          </h6>
                          <PlanOfManagementInput
                            name="opticalManagement.finalRx.os.sphere"
                            label="Sphere"
                          />
                          <PlanOfManagementInput
                            name="opticalManagement.finalRx.os.cylinder"
                            label="Cylinder"
                          />
                          <PlanOfManagementInput
                            name="opticalManagement.finalRx.os.axis"
                            label="Axis"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-3">Ocular Hygiene</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <PlanOfManagementCheckbox
                          name="ocularHygiene.increaseOutdoorActivities"
                          label="Increase Outdoor Activities"
                        />
                        <PlanOfManagementCheckbox
                          name="ocularHygiene.stopDigitalDevices"
                          label="Stop Digital Devices"
                        />
                        <PlanOfManagementCheckbox
                          name="ocularHygiene.activityCharts"
                          label="Activity Charts"
                        />
                        <PlanOfManagementCheckbox
                          name="ocularHygiene.visionBreaks"
                          label="Vision Breaks"
                        />
                      </div>
                    </div>
                  </div>
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
