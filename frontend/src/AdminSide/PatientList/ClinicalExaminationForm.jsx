// src/components/ClinicalExaminationForm.jsx
import React from "react";

// Reusable InputField component for consistency
const InputField = ({ value, onChange, className = "w-full" }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    className={`border border-gray-400 rounded text-center p-1 ${className}`}
  />
);

const ClinicalExaminationForm = ({ clinicalExam, setClinicalExam }) => {
  // Handler for nested state objects (e.g., visualAcuity.withoutGlasses.od)
  const handleNestedInputChange = (section, group, eye, field, value) => {
    setClinicalExam((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [group]: {
          ...prev[section][group],
          [eye]: {
            ...prev[section][group][eye],
            [field]: value,
          },
        },
      },
    }));
  };

  // Handler for direct nested state objects (e.g., autorefractometer.od)
  const handleInputChange = (section, eye, field, value) => {
    setClinicalExam((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [eye]: {
          ...prev[section][eye],
          [field]: value,
        },
      },
    }));
  };

  // Handler for top-level fields within a section (e.g., visualAcuity.chartUsed)
  const handleSectionFieldChange = (section, field, value) => {
    setClinicalExam((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // --- START OF NEWLY ADDED CODE ---
  // Specific handler for the deeply nested dominantEye state
  const handleDominantEyeChange = (distance, eye, value) => {
    setClinicalExam((prev) => ({
      ...prev,
      visualAcuity: {
        ...prev.visualAcuity,
        dominantEye: {
          ...prev.visualAcuity.dominantEye,
          [distance]: {
            ...prev.visualAcuity.dominantEye?.[distance],
            [eye]: value,
          },
        },
      },
    }));
  };
  // --- END OF NEWLY ADDED CODE ---

  // Reusable component for OD/OS rows with 3 inputs
  const EyeDataRow3 = ({ section, group, eye }) => (
    <div className="flex items-center space-x-2">
      <span className="font-bold w-8">{eye.toUpperCase()}</span>
      <div className="grid grid-cols-3 gap-2 w-full">
        <InputField
          value={clinicalExam[section][group][eye]?.sc || ""}
          onChange={(e) =>
            handleNestedInputChange(section, group, eye, "sc", e.target.value)
          }
        />
        <InputField
          value={clinicalExam[section][group][eye]?.ph || ""}
          onChange={(e) =>
            handleNestedInputChange(section, group, eye, "ph", e.target.value)
          }
        />
        <InputField
          value={clinicalExam[section][group][eye]?.near || ""}
          onChange={(e) =>
            handleNestedInputChange(section, group, eye, "near", e.target.value)
          }
        />
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
      <h3 className="font-bold text-center text-xl text-red-800 mb-4 border-b-2 border-red-800 pb-2">
        CLINICAL EXAMINATION
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column Container */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visual Acuity Section */}
          <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200">
            <h2 className="text-lg font-bold text-red-800">Visual Acuity</h2>
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap gap-x-6 gap-y-2 items-center">
                <span className="font-semibold">Chart Used:</span>
                <div className="flex items-center space-x-4">
                  {["Snellen", "Metric", "Decimal", "Logmar"].map((chart) => (
                    <label key={chart} className="flex items-center">
                      <input
                        type="radio"
                        name="chartUsed"
                        value={chart}
                        checked={clinicalExam.visualAcuity.chartUsed === chart}
                        onChange={(e) =>
                          handleSectionFieldChange(
                            "visualAcuity",
                            "chartUsed",
                            e.target.value
                          )
                        }
                        className="h-4 w-4 text-red-800 focus:ring-red-700"
                      />
                      <span className="ml-2 text-gray-700">{chart}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 items-center">
                <span className="font-semibold">Test Distance Used:</span>
                <div className="flex items-center space-x-4">
                  {["6M", "4M", "3M"].map((dist) => (
                    <label key={dist} className="flex items-center">
                      <input
                        type="radio"
                        name="testDistance"
                        value={dist}
                        checked={
                          clinicalExam.visualAcuity.testDistanceUsed === dist
                        }
                        onChange={(e) =>
                          handleSectionFieldChange(
                            "visualAcuity",
                            "testDistanceUsed",
                            e.target.value
                          )
                        }
                        className="h-4 w-4 text-red-800 focus:ring-red-700"
                      />
                      <span className="ml-2 text-gray-700">{dist}</span>
                    </label>
                  ))}
                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="testDistance"
                        value="Other"
                        checked={
                          clinicalExam.visualAcuity.testDistanceUsed === "Other"
                        }
                        onChange={(e) =>
                          handleSectionFieldChange(
                            "visualAcuity",
                            "testDistanceUsed",
                            e.target.value
                          )
                        }
                        className="h-4 w-4 text-red-800 focus:ring-red-700"
                      />
                      <span className="ml-2 mr-1 text-gray-700">Others:</span>
                    </label>
                    <input
                      type="text"
                      value={clinicalExam.visualAcuity.testDistanceOther || ""}
                      onChange={(e) =>
                        handleSectionFieldChange(
                          "visualAcuity",
                          "testDistanceOther",
                          e.target.value
                        )
                      }
                      className="border-b-2 border-gray-400 focus:border-red-700 outline-none w-24"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-red-700 my-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-center">Without Glasses</h3>
                <div className="grid grid-cols-3 gap-2 text-center text-sm font-medium">
                  <span>SC</span>
                  <span>PH</span>
                  <span>NEAR</span>
                </div>
                <EyeDataRow3
                  section="visualAcuity"
                  group="withoutGlasses"
                  eye="od"
                />
                <EyeDataRow3
                  section="visualAcuity"
                  group="withoutGlasses"
                  eye="os"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-center">
                  With previous eye glasses
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center text-sm font-medium">
                  <span>SC</span>
                  <span>PH</span>
                  <span>NEAR</span>
                </div>
                <EyeDataRow3
                  section="visualAcuity"
                  group="withGlasses"
                  eye="od"
                />
                <EyeDataRow3
                  section="visualAcuity"
                  group="withGlasses"
                  eye="os"
                />
              </div>
              {/* --- START OF FIX --- */}
              <div className="space-y-2">
                <h3 className="font-semibold text-center">Dominant Eye</h3>
                <div className="grid grid-cols-2 gap-4 text-center mt-2">
                  <div className="space-y-2">
                    <span className="font-semibold text-sm">Far</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold w-8">OD</span>
                      <InputField
                        value={
                          clinicalExam.visualAcuity.dominantEye?.far?.od || ""
                        }
                        onChange={(e) =>
                          handleDominantEyeChange("far", "od", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold w-8">OS</span>
                      <InputField
                        value={
                          clinicalExam.visualAcuity.dominantEye?.far?.os || ""
                        }
                        onChange={(e) =>
                          handleDominantEyeChange("far", "os", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="font-semibold text-sm">Near</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold w-8">OD</span>
                      <InputField
                        value={
                          clinicalExam.visualAcuity.dominantEye?.near?.od || ""
                        }
                        onChange={(e) =>
                          handleDominantEyeChange("near", "od", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold w-8">OS</span>
                      <InputField
                        value={
                          clinicalExam.visualAcuity.dominantEye?.near?.os || ""
                        }
                        onChange={(e) =>
                          handleDominantEyeChange("near", "os", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* --- END OF FIX --- */}
            </div>
          </div>

          {/* Autorefractometer & Autokeratometer */}
          <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-bold text-red-800">Autorefractometer</h3>
                <div className="grid grid-cols-3 gap-2 text-center text-sm font-medium">
                  <span>Sphere</span>
                  <span>Cylinder</span>
                  <span>Axis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold w-8">OD</span>
                  <div className="grid grid-cols-3 gap-2 w-full">
                    <InputField
                      value={clinicalExam.autorefractometer.od?.sphere || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "autorefractometer",
                          "od",
                          "sphere",
                          e.target.value
                        )
                      }
                    />
                    <InputField
                      value={clinicalExam.autorefractometer.od?.cylinder || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "autorefractometer",
                          "od",
                          "cylinder",
                          e.target.value
                        )
                      }
                    />
                    <InputField
                      value={clinicalExam.autorefractometer.od?.axis || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "autorefractometer",
                          "od",
                          "axis",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold w-8">OS</span>
                  <div className="grid grid-cols-3 gap-2 w-full">
                    <InputField
                      value={clinicalExam.autorefractometer.os?.sphere || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "autorefractometer",
                          "os",
                          "sphere",
                          e.target.value
                        )
                      }
                    />
                    <InputField
                      value={clinicalExam.autorefractometer.os?.cylinder || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "autorefractometer",
                          "os",
                          "cylinder",
                          e.target.value
                        )
                      }
                    />
                    <InputField
                      value={clinicalExam.autorefractometer.os?.axis || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "autorefractometer",
                          "os",
                          "axis",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2 md:border-l md:pl-6 border-gray-300">
                <h3 className="font-bold text-red-800">Autokeratometer</h3>
                <div className="grid grid-cols-3 gap-2 text-center text-sm font-medium">
                  <span>K1 (D/mm)</span>
                  <span>K2 (D/mm)</span>
                  <span>Axis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold w-8">OD</span>
                  <div className="grid grid-cols-3 gap-2 w-full">
                    <InputField
                      value={clinicalExam.autokeratometer.od?.k1 || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "autokeratometer",
                          "od",
                          "k1",
                          e.target.value
                        )
                      }
                    />
                    <InputField
                      value={clinicalExam.autokeratometer.od?.k2 || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "autokeratometer",
                          "od",
                          "k2",
                          e.target.value
                        )
                      }
                    />
                    <InputField
                      value={clinicalExam.autokeratometer.od?.axis || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "autokeratometer",
                          "od",
                          "axis",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold w-8">OS</span>
                  <div className="grid grid-cols-3 gap-2 w-full">
                    <InputField
                      value={clinicalExam.autokeratometer.os?.k1 || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "autokeratometer",
                          "os",
                          "k1",
                          e.target.value
                        )
                      }
                    />
                    <InputField
                      value={clinicalExam.autokeratometer.os?.k2 || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "autokeratometer",
                          "os",
                          "k2",
                          e.target.value
                        )
                      }
                    />
                    <InputField
                      value={clinicalExam.autokeratometer.os?.axis || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "autokeratometer",
                          "os",
                          "axis",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PD / Pupil Size & Pupil Examination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200 space-y-2">
              <h3 className="font-bold text-red-800">PD / Pupil Size</h3>
              <div className="grid grid-cols-3 gap-2 text-center text-sm font-medium">
                <span>MPD</span>
                <span>Pupil Size</span>
                <span>HVID</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold w-8">OD</span>
                <div className="grid grid-cols-3 gap-2 w-full">
                  <InputField
                    value={clinicalExam.pdPupilSize.od?.mpd || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "pdPupilSize",
                        "od",
                        "mpd",
                        e.target.value
                      )
                    }
                  />
                  <InputField
                    value={clinicalExam.pdPupilSize.od?.pupilSize || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "pdPupilSize",
                        "od",
                        "pupilSize",
                        e.target.value
                      )
                    }
                  />
                  <InputField
                    value={clinicalExam.pdPupilSize.od?.hvid || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "pdPupilSize",
                        "od",
                        "hvid",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold w-8">OS</span>
                <div className="grid grid-cols-3 gap-2 w-full">
                  <InputField
                    value={clinicalExam.pdPupilSize.os?.mpd || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "pdPupilSize",
                        "os",
                        "mpd",
                        e.target.value
                      )
                    }
                  />
                  <InputField
                    value={clinicalExam.pdPupilSize.os?.pupilSize || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "pdPupilSize",
                        "os",
                        "pupilSize",
                        e.target.value
                      )
                    }
                  />
                  <InputField
                    value={clinicalExam.pdPupilSize.os?.hvid || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "pdPupilSize",
                        "os",
                        "hvid",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200 space-y-2">
              <h3 className="font-bold text-red-800">Pupil Examination</h3>
              <div className="grid grid-cols-4 gap-2 text-center text-sm font-medium">
                <span>RAPD (+/-)</span>
                <span>Direct</span>
                <span>Consensual</span>
                <span>PERRLA</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold w-8">OD</span>
                <div className="grid grid-cols-4 gap-2 w-full">
                  <InputField
                    value={clinicalExam.pupilExamination.od?.rapd || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "pupilExamination",
                        "od",
                        "rapd",
                        e.target.value
                      )
                    }
                  />
                  <InputField
                    value={clinicalExam.pupilExamination.od?.direct || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "pupilExamination",
                        "od",
                        "direct",
                        e.target.value
                      )
                    }
                  />
                  <InputField
                    value={clinicalExam.pupilExamination.od?.consensual || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "pupilExamination",
                        "od",
                        "consensual",
                        e.target.value
                      )
                    }
                  />
                  <InputField
                    value={clinicalExam.pupilExamination.od?.perrla || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "pupilExamination",
                        "od",
                        "perrla",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold w-8">OS</span>
                <div className="grid grid-cols-4 gap-2 w-full">
                  <InputField
                    value={clinicalExam.pupilExamination.os?.rapd || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "pupilExamination",
                        "os",
                        "rapd",
                        e.target.value
                      )
                    }
                  />
                  <InputField
                    value={clinicalExam.pupilExamination.os?.direct || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "pupilExamination",
                        "os",
                        "direct",
                        e.target.value
                      )
                    }
                  />
                  <InputField
                    value={clinicalExam.pupilExamination.os?.consensual || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "pupilExamination",
                        "os",
                        "consensual",
                        e.target.value
                      )
                    }
                  />
                  <InputField
                    value={clinicalExam.pupilExamination.os?.perrla || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "pupilExamination",
                        "os",
                        "perrla",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Manifest Refraction */}
          <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200 space-y-2">
            <h3 className="font-bold text-red-800">Manifest Refraction</h3>
            <div className="grid grid-cols-6 gap-2 text-center text-sm font-medium">
              <span>Sphere</span>
              <span>Cylinder</span>
              <span>Axis</span>
              <span>VA</span>
              <span>ADD</span>
              <span>NVA</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold w-8">OD</span>
              <div className="grid grid-cols-6 gap-2 w-full">
                <InputField
                  value={clinicalExam.manifestRefraction.od?.sphere || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "manifestRefraction",
                      "od",
                      "sphere",
                      e.target.value
                    )
                  }
                />
                <InputField
                  value={clinicalExam.manifestRefraction.od?.cylinder || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "manifestRefraction",
                      "od",
                      "cylinder",
                      e.target.value
                    )
                  }
                />
                <InputField
                  value={clinicalExam.manifestRefraction.od?.axis || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "manifestRefraction",
                      "od",
                      "axis",
                      e.target.value
                    )
                  }
                />
                <InputField
                  value={clinicalExam.manifestRefraction.od?.va || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "manifestRefraction",
                      "od",
                      "va",
                      e.target.value
                    )
                  }
                />
                <InputField
                  value={clinicalExam.manifestRefraction.od?.add || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "manifestRefraction",
                      "od",
                      "add",
                      e.target.value
                    )
                  }
                />
                <InputField
                  value={clinicalExam.manifestRefraction.od?.nva || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "manifestRefraction",
                      "od",
                      "nva",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold w-8">OS</span>
              <div className="grid grid-cols-6 gap-2 w-full">
                <InputField
                  value={clinicalExam.manifestRefraction.os?.sphere || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "manifestRefraction",
                      "os",
                      "sphere",
                      e.target.value
                    )
                  }
                />
                <InputField
                  value={clinicalExam.manifestRefraction.os?.cylinder || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "manifestRefraction",
                      "os",
                      "cylinder",
                      e.target.value
                    )
                  }
                />
                <InputField
                  value={clinicalExam.manifestRefraction.os?.axis || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "manifestRefraction",
                      "os",
                      "axis",
                      e.target.value
                    )
                  }
                />
                <InputField
                  value={clinicalExam.manifestRefraction.os?.va || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "manifestRefraction",
                      "os",
                      "va",
                      e.target.value
                    )
                  }
                />
                <InputField
                  value={clinicalExam.manifestRefraction.os?.add || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "manifestRefraction",
                      "os",
                      "add",
                      e.target.value
                    )
                  }
                />
                <InputField
                  value={clinicalExam.manifestRefraction.os?.nva || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "manifestRefraction",
                      "os",
                      "nva",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          </div>

          {/* Cycloplegic AR & Cycloplegic Subj. Refraction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200 space-y-2">
              <h3 className="font-bold text-red-800">Cycloplegic AR*</h3>
              <div className="grid grid-cols-3 gap-2 text-center text-sm font-medium">
                <span>Sphere</span>
                <span>Cylinder</span>
                <span>Axis</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold w-8">OD</span>
                <div className="grid grid-cols-3 gap-2 w-full">
                  <InputField
                    value={clinicalExam.cycloplegicAR?.od?.sphere || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "cycloplegicAR",
                        "od",
                        "sphere",
                        e.target.value
                      )
                    }
                  />
                  <InputField
                    value={clinicalExam.cycloplegicAR?.od?.cylinder || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "cycloplegicAR",
                        "od",
                        "cylinder",
                        e.target.value
                      )
                    }
                  />
                  <InputField
                    value={clinicalExam.cycloplegicAR?.od?.axis || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "cycloplegicAR",
                        "od",
                        "axis",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold w-8">OS</span>
                <div className="grid grid-cols-3 gap-2 w-full">
                  <InputField
                    value={clinicalExam.cycloplegicAR?.os?.sphere || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "cycloplegicAR",
                        "os",
                        "sphere",
                        e.target.value
                      )
                    }
                  />
                  <InputField
                    value={clinicalExam.cycloplegicAR?.os?.cylinder || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "cycloplegicAR",
                        "os",
                        "cylinder",
                        e.target.value
                      )
                    }
                  />
                  <InputField
                    value={clinicalExam.cycloplegicAR?.os?.axis || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "cycloplegicAR",
                        "os",
                        "axis",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200 space-y-2">
              <h3 className="font-bold text-red-800">
                Cycloplegic Subj. Refraction*
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center text-sm font-medium">
                <span>Sphere</span>
                <span>Cylinder</span>
                <span>Axis</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold w-8">OD</span>
                <div className="grid grid-cols-3 gap-2 w-full">
                  <InputField
                    value={
                      clinicalExam.cycloplegicSubjRefraction?.od?.sphere || ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "cycloplegicSubjRefraction",
                        "od",
                        "sphere",
                        e.target.value
                      )
                    }
                  />
                  <InputField
                    value={
                      clinicalExam.cycloplegicSubjRefraction?.od?.cylinder || ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "cycloplegicSubjRefraction",
                        "od",
                        "cylinder",
                        e.target.value
                      )
                    }
                  />
                  <InputField
                    value={
                      clinicalExam.cycloplegicSubjRefraction?.od?.axis || ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "cycloplegicSubjRefraction",
                        "od",
                        "axis",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold w-8">OS</span>
                <div className="grid grid-cols-3 gap-2 w-full">
                  <InputField
                    value={
                      clinicalExam.cycloplegicSubjRefraction?.os?.sphere || ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "cycloplegicSubjRefraction",
                        "os",
                        "sphere",
                        e.target.value
                      )
                    }
                  />
                  <InputField
                    value={
                      clinicalExam.cycloplegicSubjRefraction?.os?.cylinder || ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "cycloplegicSubjRefraction",
                        "os",
                        "cylinder",
                        e.target.value
                      )
                    }
                  />
                  <InputField
                    value={
                      clinicalExam.cycloplegicSubjRefraction?.os?.axis || ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "cycloplegicSubjRefraction",
                        "os",
                        "axis",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Meds Used Section */}
          <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200">
            <div className="flex flex-wrap gap-x-6 gap-y-4 items-center text-sm">
              <span className="font-semibold">*Meds used:</span>
              <div className="flex items-center space-x-4">
                {["Tropicamide (T)", "Cyclopentolate (C)", "Atropine (A)"].map(
                  (med) => (
                    <label key={med} className="flex items-center">
                      <input
                        type="radio"
                        name="medsUsedType"
                        value={med}
                        checked={clinicalExam.medsUsed?.type === med}
                        onChange={(e) =>
                          handleSectionFieldChange(
                            "medsUsed",
                            "type",
                            e.target.value
                          )
                        }
                        className="h-4 w-4 text-red-800 focus:ring-red-700"
                      />
                      <span className="ml-2 text-gray-700">{med}</span>
                    </label>
                  )
                )}
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-gray-700">Combo-TC Others:</span>
                <input
                  type="text"
                  value={clinicalExam.medsUsed?.comboTCOthers || ""}
                  onChange={(e) =>
                    handleSectionFieldChange(
                      "medsUsed",
                      "comboTCOthers",
                      e.target.value
                    )
                  }
                  className="border-b-2 border-gray-400 focus:border-red-700 outline-none w-32"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (ARK Results) */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200 h-full flex flex-col">
            <h2 className="text-lg font-bold text-red-800 text-center">
              ARK RESULTS
            </h2>
            <textarea
              value={clinicalExam.arkResults || ""}
              onChange={(e) =>
                setClinicalExam((prev) => ({
                  ...prev,
                  arkResults: e.target.value,
                }))
              }
              className="w-full flex-grow border border-gray-400 rounded-md mt-2 p-2 resize-none min-h-[300px] lg:min-h-0"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalExaminationForm;
