// src/components/CaseHistoryTakingForm.jsx
import React from "react";

// ✅ START FIX: Define helper components outside the main component body.
// This prevents them from being redeclared on every render.

const CheckboxField = ({
  section,
  field,
  label,
  caseHistory,
  onCheckboxChange,
}) => (
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      id={`${section}-${field}`}
      checked={caseHistory[section]?.[field] ?? false}
      onChange={() => onCheckboxChange(section, field)}
      className="h-4 w-4 rounded border-gray-300 text-red-800 focus:ring-red-700"
    />
    <label htmlFor={`${section}-${field}`} className="text-gray-700">
      {label}
    </label>
  </div>
);

const OtherField = ({
  section,
  field,
  caseHistory,
  onCheckboxChange,
  onInputChange,
}) => (
  <div className="flex items-center space-x-2">
    <CheckboxField
      section={section}
      field={field}
      label="Others:"
      caseHistory={caseHistory}
      onCheckboxChange={onCheckboxChange}
    />
    <input
      type="text"
      value={caseHistory[section]?.others || ""}
      onChange={(e) => onInputChange(section, "others", e.target.value)}
      className="w-full flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm"
    />
  </div>
);

const HistorySection = ({ section, title, caseHistory, onInputChange }) => (
  <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm space-y-3">
    <h4 className="font-bold text-gray-800">{title}</h4>
    <div className="space-y-2">
      {Object.keys(caseHistory[section]).map((key) => (
        <div key={key} className="grid grid-cols-3 items-center gap-2">
          <label className="text-sm text-gray-600 capitalize">{key}</label>
          <input
            type="text"
            value={caseHistory[section][key]}
            onChange={(e) => onInputChange(section, key, e.target.value)}
            className="col-span-2 w-full px-2 py-1 border border-gray-300 rounded-md"
          />
        </div>
      ))}
    </div>
  </div>
);

// ❌ END FIX

const CaseHistoryTakingForm = ({ caseHistory, setCaseHistory }) => {
  const handleCheckboxChange = (section, field) => {
    setCaseHistory((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field],
      },
    }));
  };

  const handleInputChange = (section, field, value) => {
    setCaseHistory((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  return (
    <div className="md:col-span-2 bg-gray-50 p-5 rounded-xl">
      <h3 className="font-bold text-center text-xl text-red-800 mb-4 border-b-2 border-red-800 pb-2">
        CASE HISTORY TAKING
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column 1 */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
            <h4 className="font-bold text-gray-800">
              CHIEF COMPLAINT (Reason for visit)
            </h4>
            <div className="space-y-2 mt-2">
              <CheckboxField
                section="chiefComplaint"
                field="blurring"
                label="Blurring of vision"
                caseHistory={caseHistory}
                onCheckboxChange={handleCheckboxChange}
              />
              <CheckboxField
                section="chiefComplaint"
                field="headache"
                label="Headache"
                caseHistory={caseHistory}
                onCheckboxChange={handleCheckboxChange}
              />
              <CheckboxField
                section="chiefComplaint"
                field="doubleVision"
                label="Double vision/Misaligned Eye"
                caseHistory={caseHistory}
                onCheckboxChange={handleCheckboxChange}
              />
              <CheckboxField
                section="chiefComplaint"
                field="photophobia"
                label="Photophobia"
                caseHistory={caseHistory}
                onCheckboxChange={handleCheckboxChange}
              />
              <CheckboxField
                section="chiefComplaint"
                field="itchyEyes"
                label="Itchy eyes"
                caseHistory={caseHistory}
                onCheckboxChange={handleCheckboxChange}
              />
              <CheckboxField
                section="chiefComplaint"
                field="eyeRedness"
                label="Eye Redness"
                caseHistory={caseHistory}
                onCheckboxChange={handleCheckboxChange}
              />
              <CheckboxField
                section="chiefComplaint"
                field="eyePain"
                label="Eye Pain"
                caseHistory={caseHistory}
                onCheckboxChange={handleCheckboxChange}
              />
              <OtherField
                section="chiefComplaint"
                field="others"
                caseHistory={caseHistory}
                onCheckboxChange={handleCheckboxChange}
                onInputChange={handleInputChange}
              />
            </div>
          </div>

          <HistorySection
            section="historyOfChiefComplaint"
            title="History of CHIEF COMPLAINT"
            caseHistory={caseHistory}
            onInputChange={handleInputChange}
          />

          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm space-y-3">
            <h4 className="font-bold text-gray-800">Ocular History</h4>
            {[
              { label: "Spectacle Rx", field: "spectacleRx" },
              { label: "Spectacle Year", field: "spectacleYear" },
              { label: "Contact Lens", field: "contactLens" },
              { label: "Eye Surgery", field: "eyeSurgery" },
              { label: "Systemic Surgery", field: "systemicSurgery" },
            ].map(({ label, field }) => (
              <div key={field} className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm">{label}</label>
                <input
                  type="text"
                  value={caseHistory.ocularHistory[field] || ""}
                  onChange={(e) =>
                    handleInputChange("ocularHistory", field, e.target.value)
                  }
                  className="col-span-2 border rounded-md px-2 py-1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
            <h4 className="font-bold text-gray-800">ASSOCIATED COMPLAINT</h4>
            <div className="space-y-2 mt-2">
              <CheckboxField
                section="associatedComplaint"
                field="blurring"
                label="Blurring of vision"
                caseHistory={caseHistory}
                onCheckboxChange={handleCheckboxChange}
              />
              <CheckboxField
                section="associatedComplaint"
                field="headache"
                label="Headache"
                caseHistory={caseHistory}
                onCheckboxChange={handleCheckboxChange}
              />
              <CheckboxField
                section="associatedComplaint"
                field="doubleVision"
                label="Double vision/Misaligned Eye"
                caseHistory={caseHistory}
                onCheckboxChange={handleCheckboxChange}
              />
              <CheckboxField
                section="associatedComplaint"
                field="photophobia"
                label="Photophobia"
                caseHistory={caseHistory}
                onCheckboxChange={handleCheckboxChange}
              />
              <CheckboxField
                section="associatedComplaint"
                field="itchyEyes"
                label="Itchy eyes"
                caseHistory={caseHistory}
                onCheckboxChange={handleCheckboxChange}
              />
              <CheckboxField
                section="associatedComplaint"
                field="eyeRedness"
                label="Eye Redness"
                caseHistory={caseHistory}
                onCheckboxChange={handleCheckboxChange}
              />
              <CheckboxField
                section="associatedComplaint"
                field="eyePain"
                label="Eye Pain"
                caseHistory={caseHistory}
                onCheckboxChange={handleCheckboxChange}
              />
              <OtherField
                section="associatedComplaint"
                field="others"
                caseHistory={caseHistory}
                onCheckboxChange={handleCheckboxChange}
                onInputChange={handleInputChange}
              />
            </div>
          </div>

          <HistorySection
            section="historyOfAssociatedComplaint"
            title="History of ASSOCIATED COMPLAINT"
            caseHistory={caseHistory}
            onInputChange={handleInputChange}
          />

          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm space-y-3">
            <h4 className="font-bold text-gray-800">
              Ocular condition/history
            </h4>
            {/* ✅ START: Added Retina, Macula, EOR fields */}
            <CheckboxField
              section="ocularCondition"
              field="glaucoma"
              label="Glaucoma"
              caseHistory={caseHistory}
              onCheckboxChange={handleCheckboxChange}
            />
            <CheckboxField
              section="ocularCondition"
              field="cataract"
              label="Cataract"
              caseHistory={caseHistory}
              onCheckboxChange={handleCheckboxChange}
            />
            <CheckboxField
              section="ocularCondition"
              field="retina"
              label="Retina"
              caseHistory={caseHistory}
              onCheckboxChange={handleCheckboxChange}
            />
            <CheckboxField
              section="ocularCondition"
              field="macula"
              label="Macula"
              caseHistory={caseHistory}
              onCheckboxChange={handleCheckboxChange}
            />
            <CheckboxField
              section="ocularCondition"
              field="eor"
              label="EOR"
              caseHistory={caseHistory}
              onCheckboxChange={handleCheckboxChange}
            />
            {/* ❌ END: Added Retina, Macula, EOR fields */}
            <OtherField
              section="ocularCondition"
              field="others"
              caseHistory={caseHistory}
              onCheckboxChange={handleCheckboxChange}
              onInputChange={handleInputChange}
            />

            <h4 className="font-bold text-gray-800 pt-2 border-t mt-2">
              Family ocular condition
            </h4>
            {/* ✅ START: Added Retina, Macula, EOR fields */}
            <CheckboxField
              section="familyOcularCondition"
              field="glaucoma"
              label="Glaucoma"
              caseHistory={caseHistory}
              onCheckboxChange={handleCheckboxChange}
            />
            <CheckboxField
              section="familyOcularCondition"
              field="cataract"
              label="Cataract"
              caseHistory={caseHistory}
              onCheckboxChange={handleCheckboxChange}
            />
            <CheckboxField
              section="familyOcularCondition"
              field="retina"
              label="Retina"
              caseHistory={caseHistory}
              onCheckboxChange={handleCheckboxChange}
            />
            <CheckboxField
              section="familyOcularCondition"
              field="macula"
              label="Macula"
              caseHistory={caseHistory}
              onCheckboxChange={handleCheckboxChange}
            />
            <CheckboxField
              section="familyOcularCondition"
              field="eor"
              label="EOR"
              caseHistory={caseHistory}
              onCheckboxChange={handleCheckboxChange}
            />
            {/* ❌ END: Added Retina, Macula, EOR fields */}
            <OtherField
              section="familyOcularCondition"
              field="others"
              caseHistory={caseHistory}
              onCheckboxChange={handleCheckboxChange}
              onInputChange={handleInputChange}
            />
          </div>
        </div>

        {/* Column 3 */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
            <h4 className="font-bold text-gray-800">MEDICAL HISTORY</h4>
            <div className="space-y-2 mt-2">
              {[
                ["hypertension", "Hypertension"],
                ["cardiovascular", "Cardiovascular Problem"],
                ["diabetes", "Diabetes"],
                ["asthma", "Asthma"],
                ["allergies", "Allergies"],
                ["congenital", "Congenital"],
                ["majorSurgery", "Major Surgery/Illness"],
              ].map(([field, label]) => (
                <CheckboxField
                  key={field}
                  section="medicalHistory"
                  field={field}
                  label={label}
                  caseHistory={caseHistory}
                  onCheckboxChange={handleCheckboxChange}
                />
              ))}
              <OtherField
                section="medicalHistory"
                field="others"
                caseHistory={caseHistory}
                onCheckboxChange={handleCheckboxChange}
                onInputChange={handleInputChange}
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
            <h4 className="font-bold text-gray-800">FAMILY HISTORY</h4>
            <div className="space-y-2 mt-2">
              {[
                ["hypertension", "Hypertension"],
                ["cardiovascular", "Cardiovascular Problem"],
                ["diabetes", "Diabetes"],
                ["asthma", "Asthma"],
                ["allergies", "Allergies"],
              ].map(([field, label]) => (
                <CheckboxField
                  key={field}
                  section="familyHistory"
                  field={field}
                  label={label}
                  caseHistory={caseHistory}
                  onCheckboxChange={handleCheckboxChange}
                />
              ))}
              <OtherField
                section="familyHistory"
                field="others"
                caseHistory={caseHistory}
                onCheckboxChange={handleCheckboxChange}
                onInputChange={handleInputChange}
              />
            </div>
          </div>

          {/* ✅ START: Added Occupational History section */}
          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
            <h4 className="font-bold text-gray-800">Occupational History</h4>
            <div className="space-y-2 mt-2">
              <CheckboxField
                section="occupationalHistory"
                field="working"
                label="Working"
                caseHistory={caseHistory}
                onCheckboxChange={handleCheckboxChange}
              />
              <CheckboxField
                section="occupationalHistory"
                field="student"
                label="Student"
                caseHistory={caseHistory}
                onCheckboxChange={handleCheckboxChange}
              />
              <div className="flex items-center space-x-2">
                <label htmlFor="occupational-details" className="text-gray-700">
                  Details:
                </label>
                <input
                  type="text"
                  id="occupational-details"
                  value={caseHistory.occupationalHistory?.details || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "occupationalHistory",
                      "details",
                      e.target.value
                    )
                  }
                  className="w-full flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>
          {/* ❌ END: Added Occupational History section */}

          {/* ✅ START: Added Digital History section */}
          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
            <h4 className="font-bold text-gray-800">Digital History</h4>
            <p className="text-sm font-semibold text-gray-600">
              GADGET (No of Hrs.)
            </p>
            <div className="space-y-2 mt-2">
              {[
                { label: "Cellphone", field: "cellphone" },
                { label: "Laptop", field: "laptop" },
                { label: "Desktop", field: "desktop" },
                { label: "Television", field: "television" },
                { label: "Work", field: "work" },
                { label: "Hobbies", field: "hobbies" },
              ].map(({ label, field }) => (
                <div
                  key={field}
                  className="grid grid-cols-2 items-center gap-2"
                >
                  <label
                    htmlFor={`digital-history-${field}`}
                    className="text-gray-700"
                  >
                    {label}
                  </label>
                  <input
                    type="text"
                    id={`digital-history-${field}`}
                    value={caseHistory.digitalHistory?.[field] || ""}
                    onChange={(e) =>
                      handleInputChange("digitalHistory", field, e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* ❌ END: Added Digital History section */}
        </div>
      </div>

      <div className="mt-6 bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
        <h4 className="font-bold text-gray-800 mb-2">
          Eyeglass/Contact Lens History
        </h4>
        <div className="grid grid-cols-5 gap-px bg-gray-300 border border-gray-300">
          {[
            { header: "DD: W", field: "ddW" },
            { header: "DD: Wout", field: "ddWout" },
            { header: "Power", field: "power" },
            { header: "Lens type", field: "lensType" },
            { header: "Comment", field: "comment" },
          ].map(({ header, field }) => (
            <React.Fragment key={field}>
              <div className="bg-gray-100 p-2 text-center font-semibold text-sm">
                {header}
              </div>
            </React.Fragment>
          ))}
          {[
            { field: "ddW" },
            { field: "ddWout" },
            { field: "power" },
            { field: "lensType" },
            { field: "comment" },
          ].map(({ field }) => (
            <input
              key={field}
              type="text"
              value={caseHistory.eyeglassHistory[field] || ""}
              onChange={(e) =>
                handleInputChange("eyeglassHistory", field, e.target.value)
              }
              className="bg-white p-2 border-t border-gray-300"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseHistoryTakingForm;
