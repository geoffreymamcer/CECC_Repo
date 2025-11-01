import React from "react";
import { FaNotesMedical } from "react-icons/fa";

// Helper component for text inputs within this tab
const CaseHistoryInput = ({
  section,
  field,
  label,
  value,
  onChange,
  isEditing,
}) => (
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
      value={value || ""}
      onChange={onChange}
      disabled={!isEditing}
      className="font-medium w-full p-2 border border-gray-200 rounded-md disabled:bg-gray-100 disabled:border-gray-200 focus:ring-deep-red focus:border-deep-red"
    />
  </div>
);

// Helper component for checkboxes within this tab
const CaseHistoryCheckbox = ({
  section,
  field,
  label,
  checked,
  onChange,
  isEditing,
}) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      id={`${section}.${field}`}
      name={`${section}.${field}`}
      checked={!!checked}
      onChange={onChange}
      disabled={!isEditing}
      className="h-4 w-4 rounded border-gray-300 text-deep-red focus:ring-deep-red"
    />
    <label htmlFor={`${section}.${field}`} className="ml-2 text-gray-700">
      {label}
    </label>
  </div>
);

const CaseHistoryTab = ({
  isEditing,
  caseHistoryData,
  handleCaseHistoryChange,
}) => {
  // Determine if the case history is empty to show a message
  const isCaseHistoryEmpty = !Object.values(caseHistoryData).some((section) =>
    typeof section === "object" && section !== null
      ? Object.values(section).some((value) => value)
      : section
  );

  return (
    <div className="bg-gray-50 rounded-xl p-5 animate-fadeIn">
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
            <h5 className="font-semibold mb-3 text-gray-700">
              Chief Complaint
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <CaseHistoryCheckbox
                section="chiefComplaint"
                field="blurring"
                label="Blurring"
                checked={caseHistoryData?.chiefComplaint?.blurring}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="chiefComplaint"
                field="headache"
                label="Headache"
                checked={caseHistoryData?.chiefComplaint?.headache}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="chiefComplaint"
                field="doubleVision"
                label="Double Vision"
                checked={caseHistoryData?.chiefComplaint?.doubleVision}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="chiefComplaint"
                field="photophobia"
                label="Photophobia"
                checked={caseHistoryData?.chiefComplaint?.photophobia}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="chiefComplaint"
                field="itchyEyes"
                label="Itchy Eyes"
                checked={caseHistoryData?.chiefComplaint?.itchyEyes}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="chiefComplaint"
                field="eyeRedness"
                label="Eye Redness"
                checked={caseHistoryData?.chiefComplaint?.eyeRedness}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="chiefComplaint"
                field="eyePain"
                label="Eye Pain"
                checked={caseHistoryData?.chiefComplaint?.eyePain}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
            </div>
            <div className="mt-4">
              <CaseHistoryInput
                section="chiefComplaint"
                field="others"
                label="Others"
                value={caseHistoryData?.chiefComplaint?.others}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
            </div>
          </div>

          {/* History of Chief Complaint */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">
              History of Chief Complaint
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CaseHistoryInput
                section="historyOfChiefComplaint"
                field="frequency"
                label="Frequency"
                value={caseHistoryData?.historyOfChiefComplaint?.frequency}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="historyOfChiefComplaint"
                field="onset"
                label="Onset"
                value={caseHistoryData?.historyOfChiefComplaint?.onset}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="historyOfChiefComplaint"
                field="location"
                label="Location"
                value={caseHistoryData?.historyOfChiefComplaint?.location}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="historyOfChiefComplaint"
                field="duration"
                label="Duration"
                value={caseHistoryData?.historyOfChiefComplaint?.duration}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="historyOfChiefComplaint"
                field="relief"
                label="Relief"
                value={caseHistoryData?.historyOfChiefComplaint?.relief}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="historyOfChiefComplaint"
                field="quality"
                label="Quality"
                value={caseHistoryData?.historyOfChiefComplaint?.quality}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
            </div>
          </div>

          {/* Associated Complaint */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">
              Associated Complaint
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <CaseHistoryCheckbox
                section="associatedComplaint"
                field="blurring"
                label="Blurring"
                checked={caseHistoryData?.associatedComplaint?.blurring}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="associatedComplaint"
                field="headache"
                label="Headache"
                checked={caseHistoryData?.associatedComplaint?.headache}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="associatedComplaint"
                field="doubleVision"
                label="Double Vision"
                checked={caseHistoryData?.associatedComplaint?.doubleVision}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="associatedComplaint"
                field="photophobia"
                label="Photophobia"
                checked={caseHistoryData?.associatedComplaint?.photophobia}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="associatedComplaint"
                field="itchyEyes"
                label="Itchy Eyes"
                checked={caseHistoryData?.associatedComplaint?.itchyEyes}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="associatedComplaint"
                field="eyeRedness"
                label="Eye Redness"
                checked={caseHistoryData?.associatedComplaint?.eyeRedness}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="associatedComplaint"
                field="eyePain"
                label="Eye Pain"
                checked={caseHistoryData?.associatedComplaint?.eyePain}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
            </div>
            <div className="mt-4">
              <CaseHistoryInput
                section="associatedComplaint"
                field="others"
                label="Others"
                value={caseHistoryData?.associatedComplaint?.others}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
            </div>
          </div>

          {/* History of Associated Complaint */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">
              History of Associated Complaint
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CaseHistoryInput
                section="historyOfAssociatedComplaint"
                field="frequency"
                label="Frequency"
                value={caseHistoryData?.historyOfAssociatedComplaint?.frequency}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="historyOfAssociatedComplaint"
                field="onset"
                label="Onset"
                value={caseHistoryData?.historyOfAssociatedComplaint?.onset}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="historyOfAssociatedComplaint"
                field="location"
                label="Location"
                value={caseHistoryData?.historyOfAssociatedComplaint?.location}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="historyOfAssociatedComplaint"
                field="duration"
                label="Duration"
                value={caseHistoryData?.historyOfAssociatedComplaint?.duration}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="historyOfAssociatedComplaint"
                field="relief"
                label="Relief"
                value={caseHistoryData?.historyOfAssociatedComplaint?.relief}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="historyOfAssociatedComplaint"
                field="quality"
                label="Quality"
                value={caseHistoryData?.historyOfAssociatedComplaint?.quality}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
            </div>
          </div>

          {/* Medical History */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">
              Medical History
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <CaseHistoryCheckbox
                section="medicalHistory"
                field="hypertension"
                label="Hypertension"
                checked={caseHistoryData?.medicalHistory?.hypertension}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="medicalHistory"
                field="cardiovascular"
                label="Cardiovascular"
                checked={caseHistoryData?.medicalHistory?.cardiovascular}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="medicalHistory"
                field="diabetes"
                label="Diabetes"
                checked={caseHistoryData?.medicalHistory?.diabetes}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="medicalHistory"
                field="asthma"
                label="Asthma"
                checked={caseHistoryData?.medicalHistory?.asthma}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="medicalHistory"
                field="allergies"
                label="Allergies"
                checked={caseHistoryData?.medicalHistory?.allergies}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="medicalHistory"
                field="congenital"
                label="Congenital"
                checked={caseHistoryData?.medicalHistory?.congenital}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="medicalHistory"
                field="majorSurgery"
                label="Major Surgery"
                checked={caseHistoryData?.medicalHistory?.majorSurgery}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
            </div>
            <div className="mt-4">
              <CaseHistoryInput
                section="medicalHistory"
                field="others"
                label="Others"
                value={caseHistoryData?.medicalHistory?.others}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
            </div>
          </div>

          {/* Family History */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">Family History</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <CaseHistoryCheckbox
                section="familyHistory"
                field="hypertension"
                label="Hypertension"
                checked={caseHistoryData?.familyHistory?.hypertension}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="familyHistory"
                field="cardiovascular"
                label="Cardiovascular"
                checked={caseHistoryData?.familyHistory?.cardiovascular}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="familyHistory"
                field="diabetes"
                label="Diabetes"
                checked={caseHistoryData?.familyHistory?.diabetes}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="familyHistory"
                field="asthma"
                label="Asthma"
                checked={caseHistoryData?.familyHistory?.asthma}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="familyHistory"
                field="allergies"
                label="Allergies"
                checked={caseHistoryData?.familyHistory?.allergies}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
            </div>
            <div className="mt-4">
              <CaseHistoryInput
                section="familyHistory"
                field="others"
                label="Others"
                value={caseHistoryData?.familyHistory?.others}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
            </div>
          </div>

          {/* Ocular History */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">Ocular History</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CaseHistoryInput
                section="ocularHistory"
                field="spectacleRx"
                label="Spectacle Rx"
                value={caseHistoryData?.ocularHistory?.spectacleRx}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="ocularHistory"
                field="spectacleYear"
                label="Spectacle Year"
                value={caseHistoryData?.ocularHistory?.spectacleYear}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="ocularHistory"
                field="contactLens"
                label="Contact Lens"
                value={caseHistoryData?.ocularHistory?.contactLens}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="ocularHistory"
                field="eyeSurgery"
                label="Eye Surgery"
                value={caseHistoryData?.ocularHistory?.eyeSurgery}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="ocularHistory"
                field="systemicSurgery"
                label="Systemic Surgery"
                value={caseHistoryData?.ocularHistory?.systemicSurgery}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
            </div>
          </div>

          {/* Ocular Condition */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">
              Ocular Condition
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <CaseHistoryCheckbox
                section="ocularCondition"
                field="glaucoma"
                label="Glaucoma"
                checked={caseHistoryData?.ocularCondition?.glaucoma}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="ocularCondition"
                field="cataract"
                label="Cataract"
                checked={caseHistoryData?.ocularCondition?.cataract}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <CaseHistoryInput
                section="ocularCondition"
                field="retina"
                label="Retina"
                value={caseHistoryData?.ocularCondition?.retina}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="ocularCondition"
                field="macula"
                label="Macula"
                value={caseHistoryData?.ocularCondition?.macula}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="ocularCondition"
                field="eor"
                label="EOR"
                value={caseHistoryData?.ocularCondition?.eor}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="ocularCondition"
                field="others"
                label="Others"
                value={caseHistoryData?.ocularCondition?.others}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
            </div>
          </div>

          {/* Family Ocular Condition */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">
              Family Ocular Condition
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <CaseHistoryCheckbox
                section="familyOcularCondition"
                field="glaucoma"
                label="Glaucoma"
                checked={caseHistoryData?.familyOcularCondition?.glaucoma}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryCheckbox
                section="familyOcularCondition"
                field="cataract"
                label="Cataract"
                checked={caseHistoryData?.familyOcularCondition?.cataract}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <CaseHistoryInput
                section="familyOcularCondition"
                field="retina"
                label="Retina"
                value={caseHistoryData?.familyOcularCondition?.retina}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="familyOcularCondition"
                field="macula"
                label="Macula"
                value={caseHistoryData?.familyOcularCondition?.macula}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="familyOcularCondition"
                field="eor"
                label="EOR"
                value={caseHistoryData?.familyOcularCondition?.eor}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="familyOcularCondition"
                field="others"
                label="Others"
                value={caseHistoryData?.familyOcularCondition?.others}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
            </div>
          </div>

          {/* Eyeglass History */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">
              Eyeglass History
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CaseHistoryInput
                section="eyeglassHistory"
                field="ddW"
                label="DD W"
                value={caseHistoryData?.eyeglassHistory?.ddW}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="eyeglassHistory"
                field="ddWout"
                label="DD Wout"
                value={caseHistoryData?.eyeglassHistory?.ddWout}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="eyeglassHistory"
                field="power"
                label="Power"
                value={caseHistoryData?.eyeglassHistory?.power}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <CaseHistoryInput
                section="eyeglassHistory"
                field="lensType"
                label="Lens Type"
                value={caseHistoryData?.eyeglassHistory?.lensType}
                onChange={handleCaseHistoryChange}
                isEditing={isEditing}
              />
              <div className="md:col-span-2">
                <CaseHistoryInput
                  section="eyeglassHistory"
                  field="comment"
                  label="Comment"
                  value={caseHistoryData?.eyeglassHistory?.comment}
                  onChange={handleCaseHistoryChange}
                  isEditing={isEditing}
                />
              </div>
            </div>
          </div>

          {/* Occupational & Digital History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <h5 className="font-semibold mb-3 text-gray-700">
                Occupational History
              </h5>
              <div className="flex space-x-6">
                <CaseHistoryCheckbox
                  section="occupationalHistory"
                  field="working"
                  label="Working"
                  checked={caseHistoryData?.occupationalHistory?.working}
                  onChange={handleCaseHistoryChange}
                  isEditing={isEditing}
                />
                <CaseHistoryCheckbox
                  section="occupationalHistory"
                  field="student"
                  label="Student"
                  checked={caseHistoryData?.occupationalHistory?.student}
                  onChange={handleCaseHistoryChange}
                  isEditing={isEditing}
                />
              </div>
              <div className="mt-4">
                <CaseHistoryInput
                  section="occupationalHistory"
                  field="details"
                  label="Details"
                  value={caseHistoryData?.occupationalHistory?.details}
                  onChange={handleCaseHistoryChange}
                  isEditing={isEditing}
                />
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h5 className="font-semibold mb-3 text-gray-700">
                Digital History
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CaseHistoryInput
                  section="digitalHistory"
                  field="cellphone"
                  label="Cellphone Usage"
                  value={caseHistoryData?.digitalHistory?.cellphone}
                  onChange={handleCaseHistoryChange}
                  isEditing={isEditing}
                />
                <CaseHistoryInput
                  section="digitalHistory"
                  field="laptop"
                  label="Laptop Usage"
                  value={caseHistoryData?.digitalHistory?.laptop}
                  onChange={handleCaseHistoryChange}
                  isEditing={isEditing}
                />
                <CaseHistoryInput
                  section="digitalHistory"
                  field="desktop"
                  label="Desktop Usage"
                  value={caseHistoryData?.digitalHistory?.desktop}
                  onChange={handleCaseHistoryChange}
                  isEditing={isEditing}
                />
                <CaseHistoryInput
                  section="digitalHistory"
                  field="television"
                  label="Television Usage"
                  value={caseHistoryData?.digitalHistory?.television}
                  onChange={handleCaseHistoryChange}
                  isEditing={isEditing}
                />
                <CaseHistoryInput
                  section="digitalHistory"
                  field="work"
                  label="Work Related"
                  value={caseHistoryData?.digitalHistory?.work}
                  onChange={handleCaseHistoryChange}
                  isEditing={isEditing}
                />
                <CaseHistoryInput
                  section="digitalHistory"
                  field="hobbies"
                  label="Hobbies"
                  value={caseHistoryData?.digitalHistory?.hobbies}
                  onChange={handleCaseHistoryChange}
                  isEditing={isEditing}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseHistoryTab;
