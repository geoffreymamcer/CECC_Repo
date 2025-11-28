import React, { useState, useMemo, useEffect } from "react";
import {
  FaPlus,
  FaTimes,
  FaCalendarAlt,
  FaArrowLeft,
  FaArrowRight,
  FaSave,
} from "react-icons/fa";
import instance from "../../api/axios";

// Import all required JSON data and form components
import regions from "../../services/phAddress/region.json";
import provinces from "../../services/phAddress/province.json";
import cities from "../../services/phAddress/city.json";
import barangays from "../../services/phAddress/barangay.json";
import CaseHistoryTakingForm from "./CaseHistoryTakingForm";
import ClinicalExaminationForm from "./ClinicalExaminationForm";
import BasicBinocularVisionTests from "./BasicBinocularVisionTests";
import SlitLampFunduscopyForm from "./SlitLampFunduscopyForm";
import DiagnosticAssessmentPlanForm from "./DiagnosticAssessmentPlanForm";
import PlanOfManagementForm from "./PlanOfManagementForm";

const AddPatientModal = ({ handleCloseModal, handleAddPatient }) => {
  // --- WIZARD STATE ---
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // --- PERSONAL INFO STATES ---
  const [patientId, setPatientId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [contact, setContact] = useState("");
  const [occupation, setOccupation] = useState("");
  const [otherOccupation, setOtherOccupation] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [referralBy, setReferralBy] = useState("");
  const [ageCategory, setAgeCategory] = useState("");

  // --- CLINICAL DATA STATES (with full initial structures) ---
  const [caseHistory, setCaseHistory] = useState({
    chiefComplaint: {
      blurring: false,
      headache: false,
      doubleVision: false,
      photophobia: false,
      itchyEyes: false,
      eyeRedness: false,
      eyePain: false,
      others: "",
    },
    associatedComplaint: {
      blurring: false,
      headache: false,
      doubleVision: false,
      photophobia: false,
      itchyEyes: false,
      eyeRedness: false,
      eyePain: false,
      others: "",
    },
    medicalHistory: {
      hypertension: false,
      cardiovascular: false,
      diabetes: false,
      asthma: false,
      allergies: false,
      congenital: false,
      majorSurgery: false,
      others: "",
    },
    historyOfChiefComplaint: {
      frequency: "",
      onset: "",
      location: "",
      duration: "",
      relief: "",
      quality: "",
    },
    historyOfAssociatedComplaint: {
      frequency: "",
      onset: "",
      location: "",
      duration: "",
      relief: "",
      quality: "",
    },
    familyHistory: {
      hypertension: false,
      cardiovascular: false,
      diabetes: false,
      asthma: false,
      allergies: false,
      others: "",
    },
    ocularHistory: {
      spectacleRx: "",
      spectacleYear: "",
      contactLens: "",
      eyeSurgery: "",
      systemicSurgery: "",
    },
    ocularCondition: {
      glaucoma: false,
      cataract: false,
      retina: "",
      macula: "",
      eor: "",
      others: "",
    },
    familyOcularCondition: {
      glaucoma: false,
      cataract: false,
      retina: "",
      macula: "",
      eor: "",
      others: "",
    },
    occupationalHistory: { working: false, student: false, details: "" },
    digitalHistory: {
      cellphone: "",
      laptop: "",
      desktop: "",
      television: "",
      work: "",
      hobbies: "",
    },
    eyeglassHistory: {
      ddW: "",
      ddWout: "",
      power: "",
      lensType: "",
      comment: "",
    },
  });

  const [clinicalExam, setClinicalExam] = useState({
    visualAcuity: {
      chartUsed: "",
      testDistanceUsed: "",
      testDistanceOther: "",
      withoutGlasses: { od: {}, os: {} },
      withGlasses: { od: {}, os: {} },
      dominantEye: { far: { od: "", os: "" }, near: { od: "", os: "" } },
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
  });

  const [binocularTests, setBinocularTests] = useState({
    binocularTests: { angleEst6m: {}, angleEst33cm: {} },
    monocularTests: { npa: {}, ocularMotilityDuction: {} },
  });

  const [slitLampFunduscopy, setSlitLampFunduscopy] = useState({
    slitLamp: { od: {}, os: {} },
    funduscopy: { od: {}, os: {} },
  });

  const [diagnosticPlan, setDiagnosticPlan] = useState({
    diagnosticTests: {
      aberrometry: false,
      cornealTopography: false,
      pachymetry: false,
      biometry: false,
      visualField: false,
      glareAndContrast: false,
      fundusPhoto: false,
      anteriorOct: false,
      posteriorOct: false,
      nerveFiberAnalyzer: false,
    },
    interpretationOfResults: "",
    assessment: { primaryImpression: "", secondaryImpression: "" },
    planManagement: [
      {
        od: { meds: "", quantity: "", frequency: "", duration: "" },
        os: { meds: "", quantity: "", frequency: "", duration: "" },
      },
      {
        od: { meds: "", quantity: "", frequency: "", duration: "" },
        os: { meds: "", quantity: "", frequency: "", duration: "" },
      },
    ],
  });

  const [planOfManagement, setPlanOfManagement] = useState({
    slitLampManagement: { od: "", os: "" },
    opticalManagement: { finalRx: { od: {}, os: {} }, frameMeasurements: {} },
    contactLensManagement: { finalRx: { od: {}, os: {} } },
    eyeCareSolutions: {},
    therapy: { patching: {} },
    ocularHygiene: {},
    referralAndFollowUp: {},
  });

  // --- HELPER FUNCTIONS & EFFECTS (Unchanged) ---
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
  const filteredProvinces = useMemo(
    () => provinces.filter((p) => p.region_code === selectedRegion),
    [selectedRegion]
  );
  const filteredCities = useMemo(
    () => cities.filter((c) => c.province_code === selectedProvince),
    [selectedProvince]
  );
  const filteredBarangays = useMemo(
    () => barangays.filter((b) => b.city_code === selectedCity),
    [selectedCity]
  );
  const getAgeCategory = (calculatedAge) => {
    if (calculatedAge <= 12) return "Child: 0-12";
    if (calculatedAge <= 19) return "Teen: 13-19";
    if (calculatedAge <= 39) return "Adult: 20-39";
    if (calculatedAge <= 59) return "Middle Age: 40-59";
    return "Senior: 60 & up";
  };
  const handleDobChange = (e) => {
    const selectedDob = e.target.value;
    setDob(selectedDob);
    if (selectedDob) {
      const birthDate = new Date(selectedDob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
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
  useEffect(() => {
    const generatePatientId = async () => {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2); // Get "25" from 2025

      let isUnique = false;
      let newId = "";

      while (!isUnique) {
        const randomNum = Math.floor(Math.random() * 10000);
        const paddedNum = randomNum.toString().padStart(4, "0");
        newId = `CECC${year}-${paddedNum}`;

        try {
          const checkRes = await instance.get(`/users/check/${newId}`);
          if (!checkRes.data.exists) {
            isUnique = true;
          }
        } catch (err) {
          isUnique = true;
        }
      }

      setPatientId(newId);
    };

    generatePatientId();
  }, []);

  // --- WIZARD NAVIGATION LOGIC ---
  const totalSteps = 7; // 1 (Personal) + 6 (Clinical Forms)
  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (andClose = false) => {
    if (isSaving) return;
    if (!firstName || !lastName || !dob || !gender || !contact) {
      alert(
        "Please fill in all required personal information fields (First Name, Last Name, DOB, Gender, Contact) before saving."
      );
      setCurrentStep(1);
      return;
    }
    setIsSaving(true);

    try {
      const finalOccupation =
        occupation === "Other" ? otherOccupation : occupation;
      const regionName =
        regions.find((r) => r.region_code === selectedRegion)?.region_name ||
        "";
      const provinceName =
        provinces.find((p) => p.province_code === selectedProvince)
          ?.province_name || "";
      const cityName =
        cities.find((c) => c.city_code === selectedCity)?.city_name || "";
      const barangayName =
        barangays.find((b) => b.brgy_code === selectedBarangay)?.brgy_name ||
        "";
      const profileData = {
        _id: patientId,
        patientId,
        firstName,
        middleName,
        lastName,
        dob,
        age: parseInt(age),
        ageCategory,
        gender,
        civilStatus,
        occupation: finalOccupation,
        contact,
        referralBy,
        region: regionName,
        province: provinceName,
        city: cityName,
        barangay: barangayName,
        street_subdivision: streetAddress,
      };

      const profileResponse = await instance.post("/profiles", profileData);
      const createdProfile = profileResponse.data;

      const visitResponse = await instance.post("/visits", {
        patientId: createdProfile._id,
      });
      const newVisit = visitResponse.data;

      const updatePromises = [
        instance.put(`/casehistory/visit/${newVisit.caseHistory}`, caseHistory),
        instance.put(
          `/clinical-examination/visit/${newVisit.clinicalExamination}`,
          clinicalExam
        ),
        instance.put(
          `/binocular-tests/visit/${newVisit.basicBinocularVisionTests}`,
          binocularTests
        ),
        instance.put(
          `/slit-lamp-funduscopy/visit/${newVisit.slitLampFunduscopy}`,
          slitLampFunduscopy
        ),
        instance.put(
          `/diagnostic-assessment-plan/visit/${newVisit.diagnosticAssessmentPlan}`,
          diagnosticPlan
        ),
        instance.put(
          `/plan-of-management/visit/${newVisit.planOfManagement}`,
          planOfManagement
        ),
      ];
      await Promise.all(updatePromises);

      alert("Patient added successfully!");
      handleAddPatient(createdProfile);
      if (andClose) handleCloseModal();
    } catch (error) {
      console.error("Failed to add new patient:", error);
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- RENDER LOGIC FOR CURRENT STEP ---
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Patient ID, Name Fields, DOB, Age, etc. */}
              {/* This is the full JSX for the personal info form */}
              <div className="md:col-span-2">
                <label
                  htmlFor="patientId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Patient ID
                </label>
                <input
                  id="patientId"
                  type="text"
                  value={patientId}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="middleName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Middle Name
                  </label>
                  <input
                    id="middleName"
                    type="text"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="relative">
                <label
                  htmlFor="dob"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date of Birth
                </label>
                <input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={handleDobChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <FaCalendarAlt className="absolute right-3 top-9 text-gray-400" />
              </div>
              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Age
                </label>
                <input
                  id="age"
                  type="text"
                  value={age}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="ageCategory"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Age Category
                </label>
                <input
                  id="ageCategory"
                  type="text"
                  value={ageCategory}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="civilStatus"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Civil Status
                </label>
                <select
                  id="civilStatus"
                  value={civilStatus}
                  onChange={(e) => setCivilStatus(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Civil Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Legally Separated">Legally Separated</option>
                </select>
              </div>
              <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-md font-semibold text-gray-800 mb-2">
                  Address
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <select
                    value={selectedRegion}
                    onChange={(e) => {
                      setSelectedRegion(e.target.value);
                      setSelectedProvince("");
                      setSelectedCity("");
                      setSelectedBarangay("");
                    }}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    disabled={!selectedRegion}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    disabled={!selectedProvince}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    disabled={!selectedCity}
                  >
                    <option value="">Select Barangay</option>
                    {filteredBarangays.map((b) => (
                      <option key={b.brgy_code} value={b.brgy_code}>
                        {b.brgy_name}
                      </option>
                    ))}
                  </select>
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="Street / Subdivision (optional)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label
                      htmlFor="contact"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Contact
                    </label>
                    <input
                      id="contact"
                      type="number"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="occupation"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Occupation
                    </label>
                    <select
                      id="occupation"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="referral"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Referral By
                </label>
                <input
                  id="referral"
                  type="text"
                  value={referralBy}
                  onChange={(e) => setReferralBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <CaseHistoryTakingForm
            caseHistory={caseHistory}
            setCaseHistory={setCaseHistory}
          />
        );
      case 3:
        return (
          <ClinicalExaminationForm
            clinicalExam={clinicalExam}
            setClinicalExam={setClinicalExam}
          />
        );
      case 4:
        return (
          <BasicBinocularVisionTests
            binocularTests={binocularTests}
            setBinocularTests={setBinocularTests}
          />
        );
      case 5:
        return (
          <SlitLampFunduscopyForm
            slitLampFunduscopy={slitLampFunduscopy}
            setSlitLampFunduscopy={setSlitLampFunduscopy}
          />
        );
      case 6:
        return (
          <DiagnosticAssessmentPlanForm
            diagnosticPlan={diagnosticPlan}
            setDiagnosticPlan={setDiagnosticPlan}
          />
        );
      case 7:
        return (
          <PlanOfManagementForm
            planOfManagement={planOfManagement}
            setPlanOfManagement={setPlanOfManagement}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[95vh] flex flex-col shadow-2xl">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Add New Patient
            </h2>
            <div className="text-sm font-medium text-gray-500">
              Step {currentStep} of {totalSteps}
            </div>
            <button
              onClick={handleCloseModal}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto p-6">{renderStep()}</div>
        <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1 || isSaving}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Previous
            </button>
            <div className="flex space-x-4">
              {currentStep === 1 && (
                <button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave className="mr-2" />{" "}
                  {isSaving ? "Saving..." : "Save & Close"}
                </button>
              )}
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#7F0000] to-[#8B0000] text-white rounded-xl hover:opacity-90 flex items-center disabled:opacity-50"
                >
                  Next <FaArrowRight className="ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#7F0000] to-[#8B0000] text-white rounded-xl hover:opacity-90 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave className="mr-2" />{" "}
                  {isSaving ? "Saving..." : "Save & Finish"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatientModal;
