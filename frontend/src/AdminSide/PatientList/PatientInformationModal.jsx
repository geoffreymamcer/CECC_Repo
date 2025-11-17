import React, { useState, useEffect, useMemo, useCallback } from "react";
import instance from "../../api/axios";
import { FaUserMd, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import { IoMdPerson, IoMdCall, IoMdMail, IoMdHome } from "react-icons/io";

import NewVisitModal from "./NewVisitModal";
import InvoiceInputModal from "./InvoiceModal";

// Import the tab components
import PersonalDetailsTab from "./patientModalTabs/PersonalDetailsTab";
import CaseHistoryTab from "./patientModalTabs/CaseHistoryTab";
import ClinicalExaminationTab from "./patientModalTabs/ClinicalExaminationTab";
import BinocularTestsTab from "./patientModalTabs/BinocularTestsTab";
import SlitLampTab from "./patientModalTabs/SlitLampTab";
import DiagnosticPlanTab from "./patientModalTabs/DiagnosticPlanTab";
import PlanOfManagementTab from "./patientModalTabs/PlanOfManagementTab";
import InvoiceTab from "./patientModalTabs/InvoiceTab";
import DownloadablesTab from "./patientModalTabs/DownloadablesTab";

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
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);

  const [pdfLoadingState, setPdfLoadingState] = useState({
    view: null,
    download: null,
  });

  // --- NEW: Visit-based states ---
  const [visitList, setVisitList] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isClinicalDataLoading, setIsClinicalDataLoading] = useState(false);

  // UI / modal states
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showNewVisitModal, setShowNewVisitModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const currentUser = "Dr. Philip Richard Budiongan";

  // Form and clinical states (kept from your current implementation)
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
    opticalManagement: { finalRx: { od: {}, os: {} }, frameMeasurements: {} },
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
    () => patient?._id || patient?.patientId || patient?.id,
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

  // --- NEW: initial fetch to load profile + visits + invoices ---
  const fetchInitialData = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    setError(null);

    try {
      // The 'api' instance handles the Authorization header automatically
      const [profileRes, visitsRes, invoicesRes] = await Promise.all([
        instance.get(`/profiles/id/${patientId}`),
        instance.get(`/visits/patient/${patientId}`),
        instance.get(`/invoices/patient/${patientId}`),
      ]);

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

      // map profile address to codes if available
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

      const sortedVisits = (visitsRes.data || []).sort(
        (a, b) => new Date(b.visitDate) - new Date(a.visitDate)
      );
      setVisitList(sortedVisits);
      if (sortedVisits.length > 0) {
        setSelectedVisit(sortedVisits[0]); // auto-select latest visit
      } else {
        setSelectedVisit(null);
      }

      setInvoices(invoicesRes.data || []);
    } catch (err) {
      console.error("Error fetching initial patient data:", err);
      setError("Failed to fetch patient data.");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // --- NEW: fetch clinical data for a specific visit ---
  const fetchClinicalDataForVisit = useCallback(async () => {
    if (!selectedVisit?._id) {
      // Clear all clinical data if no visit is selected
      setCaseHistoryData({});
      setClinicalExaminationData(initialClinicalExamState);
      setBasicBinocularTestsData(initialBinocularTestsState);
      setSlitLampData(initialSlitLampState);
      setDiagnosticPlanData(initialDiagnosticPlanState);
      setPlanOfManagementData(initialPlanOfManagementState);
      return;
    }

    setIsClinicalDataLoading(true);

    try {
      // Use the 'api' instance for all clinical data requests
      const promises = [
        selectedVisit.caseHistory
          ? instance.get(`/casehistory/visit/${selectedVisit.caseHistory}`)
          : Promise.resolve({ data: {} }),
        selectedVisit.clinicalExamination
          ? instance.get(
              `/clinical-examination/visit/${selectedVisit.clinicalExamination}`
            )
          : Promise.resolve({ data: {} }),
        selectedVisit.basicBinocularVisionTests
          ? instance.get(
              `/binocular-tests/visit/${selectedVisit.basicBinocularVisionTests}`
            )
          : Promise.resolve({ data: {} }),
        selectedVisit.slitLampFunduscopy
          ? instance.get(
              `/slit-lamp-funduscopy/visit/${selectedVisit.slitLampFunduscopy}`
            )
          : Promise.resolve({ data: {} }),
        selectedVisit.diagnosticAssessmentPlan
          ? instance.get(
              `/diagnostic-assessment-plan/visit/${selectedVisit.diagnosticAssessmentPlan}`
            )
          : Promise.resolve({ data: {} }),
        selectedVisit.planOfManagement
          ? instance.get(
              `/plan-of-management/visit/${selectedVisit.planOfManagement}`
            )
          : Promise.resolve({ data: {} }),
      ];

      const [
        caseHistoryRes,
        clinicalExamRes,
        binocularTestsRes,
        slitLampRes,
        diagnosticPlanRes,
        planOfManagementRes,
      ] = await Promise.all(promises);

      setCaseHistoryData(caseHistoryRes.data || {});
      setClinicalExaminationData(
        clinicalExamRes.data || initialClinicalExamState
      );
      setBasicBinocularTestsData(
        binocularTestsRes.data || initialBinocularTestsState
      );
      setSlitLampData(slitLampRes.data || initialSlitLampState);
      setDiagnosticPlanData(
        diagnosticPlanRes.data || initialDiagnosticPlanState
      );
      setPlanOfManagementData(
        planOfManagementRes.data || initialPlanOfManagementState
      );
    } catch (err) {
      console.error(
        `Error fetching data for visit ${selectedVisit?._id}:`,
        err
      );
      setError("Failed to load records for the selected visit.");
    } finally {
      setIsClinicalDataLoading(false);
    }
  }, [selectedVisit]);

  // Effects
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    fetchClinicalDataForVisit();
  }, [fetchClinicalDataForVisit]);

  // Handlers: form changes (kept your deep-copy pattern)
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

  const handleClinicalExaminationChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setClinicalExaminationData((prev) => {
      const newState = JSON.parse(JSON.stringify(prev));
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
    const keys = name.split(".");

    setBasicBinocularTestsData((prev) => {
      const newState = JSON.parse(JSON.stringify(prev));
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
    const keys = name.split(".");

    setSlitLampData((prev) => {
      const newState = JSON.parse(JSON.stringify(prev));
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

  // Visit selection handler
  const handleVisitChange = (e) => {
    const visitId = e.target.value;
    const newSelected = visitList.find((v) => v._id === visitId) || null;
    setSelectedVisit(newSelected);
  };

  // New visit flows
  const handleAddNewVisit = () => setShowNewVisitModal(true);
  const handleCloseNewVisitModal = () => setShowNewVisitModal(false);
  const handleNewVisitSave = () => {
    setShowNewVisitModal(false);
    fetchInitialData(); // refresh visits & profile
  };

  // PDF handlers (kept)
  const handleViewPDF = async (invoiceId) => {
    // Set the loading state to this invoice's ID before starting the request
    setPdfLoadingState((prev) => ({ ...prev, view: invoiceId }));
    try {
      const response = await instance.get(`/invoices/${invoiceId}/pdf/view`, {
        responseType: "blob",
      });
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Error viewing PDF:", error);
      alert("Failed to view PDF. Please try again.");
    } finally {
      // Always reset the loading state, whether the request succeeded or failed
      setPdfLoadingState((prev) => ({ ...prev, view: null }));
    }
  };

  const handleDownloadPDF = async (invoiceId, invoiceNumber) => {
    // Set the loading state for the download action
    setPdfLoadingState((prev) => ({ ...prev, download: invoiceId }));
    try {
      const response = await instance.get(
        `/invoices/${invoiceId}/pdf/download`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      // Reset the loading state after the operation completes
      setPdfLoadingState((prev) => ({ ...prev, download: null }));
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    if (!patientId) {
      alert("Error: Patient ID is missing.");
      return;
    }

    // --- REMOVED --- The problematic check that blocked saving profile details is now gone.
    // if (!selectedVisit?._id) {
    //   alert("No visit selected. Cannot save clinical data.");
    //   return;
    // }

    try {
      // --- Step 1: Construct the payload for the Profile update ---
      const nameParts = (personalFormData.fullName || "").trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName =
        nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
      const middleName =
        nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";

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

      // Always prepare the promise to update the profile.
      const profileUpdatePromise = instance.put(
        `/profiles/${patientId}`,
        profilePayload
      );

      const allPromises = [profileUpdatePromise];

      // Conditionally add promises for clinical data ONLY if a visit is selected.
      if (selectedVisit?._id) {
        const clinicalPromises = [
          instance.put(
            `/casehistory/visit/${selectedVisit.caseHistory}`,
            caseHistoryData
          ),
          instance.put(
            `/clinical-examination/visit/${selectedVisit.clinicalExamination}`,
            clinicalExaminationData
          ),
          instance.put(
            `/binocular-tests/visit/${selectedVisit.basicBinocularVisionTests}`,
            basicBinocularTestsData
          ),
          instance.put(
            `/slit-lamp-funduscopy/visit/${selectedVisit.slitLampFunduscopy}`,
            slitLampData
          ),
          instance.put(
            `/diagnostic-assessment-plan/visit/${selectedVisit.diagnosticAssessmentPlan}`,
            diagnosticPlanData
          ),
          instance.put(
            `/plan-of-management/visit/${selectedVisit.planOfManagement}`,
            planOfManagementData
          ),
        ];
        allPromises.push(...clinicalPromises);
      }

      // Execute all prepared promises. This will be just the profile update
      // if no visit is selected, or both profile and clinical data if a visit is selected.
      await Promise.all(allPromises);

      alert("Changes saved successfully!");
      setIsEditing(false);
      if (typeof onDataUpdate === "function") {
        onDataUpdate();
      }

      fetchClinicalDataForVisit();
    } catch (err) {
      console.error("Failed to save changes:", err);
      alert(
        "Failed to save changes. Please check the console for details and try again."
      );
    }
  };

  // Cancel: discard edits -> reload current visit + profile
  const handleCancel = () => {
    setIsEditing(false);
    fetchInitialData();
    fetchClinicalDataForVisit();
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

  const tabs = [
    { id: "personal", label: "Personal Details" },
    { id: "caseHistory", label: "Case History" },
    { id: "clinicalExamination", label: "Clinical Examination" },
    { id: "binocularTests", label: "Binocular Tests" },
    { id: "slitLamp", label: "Slit Lamp" },
    { id: "diagnosticPlan", label: "Diagnostic Plan" },
    { id: "planOfManagement", label: "Plan of Management" },
    { id: "invoice", label: "Invoice" },
    { id: "downloadables", label: "Downloadables" },
  ];

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

          {/* --- VISIT DROPDOWN + ADD BUTTON --- */}
          <div className="mb-6 px-4 py-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <label
                htmlFor="visit-date-selector"
                className="text-sm font-medium text-gray-800"
              >
                Viewing Records For:
              </label>
              <select
                id="visit-date-selector"
                value={selectedVisit?._id || ""}
                onChange={handleVisitChange}
                disabled={isEditing || visitList.length === 0}
                className="font-semibold text-gray-900 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-deep-red focus:border-deep-red"
              >
                {visitList.length > 0 ? (
                  visitList.map((visit, index) => (
                    <option key={visit._id} value={visit._id}>
                      {new Date(visit.visitDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      {index === 0 && " (Latest)"}
                    </option>
                  ))
                ) : (
                  <option value="">No Visit History</option>
                )}
              </select>
            </div>
            <button
              onClick={handleAddNewVisit}
              className="px-4 py-2 bg-gradient-to-r from-deep-red to-dark-red text-white rounded-xl hover:opacity-90 transition-all text-sm font-semibold shadow-md"
            >
              + Add New Visit
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <div className="overflow-x-auto">
              <div className="flex space-x-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`pb-3 px-1 font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "text-deep-red border-b-2 border-deep-red"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mb-8">
            {activeTab === "personal" && (
              <PersonalDetailsTab
                isEditing={isEditing}
                personalFormData={personalFormData}
                addressFormData={addressFormData}
                handlePersonalChange={handlePersonalChange}
                handleAddressChange={handleAddressChange}
                setAddressFormData={setAddressFormData}
                patient={patientDetails}
                filteredProvinces={filteredProvinces}
                filteredCities={filteredCities}
                filteredBarangays={filteredBarangays}
                regions={regions}
                provinces={provinces}
                cities={cities}
                barangays={barangays}
              />
            )}

            {/* Show loader for clinical tabs when switching visits */}
            {isClinicalDataLoading &&
              activeTab !== "personal" &&
              activeTab !== "invoice" && (
                <div className="text-center p-10 text-gray-500">
                  <p>Loading Clinical Records for Selected Visit...</p>
                </div>
              )}

            {!isClinicalDataLoading && activeTab === "caseHistory" && (
              <CaseHistoryTab
                isEditing={isEditing}
                caseHistoryData={caseHistoryData}
                handleCaseHistoryChange={handleCaseHistoryChange}
              />
            )}

            {!isClinicalDataLoading && activeTab === "clinicalExamination" && (
              <ClinicalExaminationTab
                isEditing={isEditing}
                clinicalExaminationData={clinicalExaminationData}
                handleClinicalExaminationChange={
                  handleClinicalExaminationChange
                }
              />
            )}

            {!isClinicalDataLoading && activeTab === "binocularTests" && (
              <BinocularTestsTab
                isEditing={isEditing}
                basicBinocularTestsData={basicBinocularTestsData}
                handleBinocularTestsChange={handleBinocularTestsChange}
              />
            )}

            {!isClinicalDataLoading && activeTab === "slitLamp" && (
              <SlitLampTab
                isEditing={isEditing}
                slitLampData={slitLampData}
                handleSlitLampChange={handleSlitLampChange}
              />
            )}

            {!isClinicalDataLoading && activeTab === "diagnosticPlan" && (
              <DiagnosticPlanTab
                isEditing={isEditing}
                diagnosticPlanData={diagnosticPlanData}
                handleDiagnosticPlanChange={handleDiagnosticPlanChange}
              />
            )}

            {!isClinicalDataLoading && activeTab === "planOfManagement" && (
              <PlanOfManagementTab
                isEditing={isEditing}
                planOfManagementData={planOfManagementData}
                handlePlanOfManagementChange={handlePlanOfManagementChange}
              />
            )}

            {activeTab === "invoice" && (
              // 3️⃣ START: Pass the new loading state down to the InvoiceTab
              <InvoiceTab
                invoices={invoices}
                isLoadingInvoices={isLoadingInvoices}
                handleViewPDF={handleViewPDF}
                handleDownloadPDF={handleDownloadPDF}
                setShowInvoiceModal={setShowInvoiceModal}
                pdfLoadingState={pdfLoadingState} // Pass the state as a prop
              />
            )}
            {activeTab === "downloadables" && (
              <DownloadablesTab
                patient={patientDetails}
                visitList={visitList}
              />
            )}
          </div>

          {/* Action Buttons */}
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
