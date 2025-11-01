import React from "react";
import { FaFileMedical, FaStethoscope } from "react-icons/fa";

const PersonalDetailsTab = ({
  isEditing,
  personalFormData,
  addressFormData,
  handlePersonalChange,
  handleAddressChange,
  setAddressFormData,
  patient,
  filteredProvinces,
  filteredCities,
  filteredBarangays,
  regions,
  provinces,
  cities,
  barangays,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
      {/* Personal Information Column */}
      <div className="bg-gray-50 rounded-xl p-5">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
          <FaFileMedical className="mr-2 text-deep-red" />
          Personal Information
        </h4>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600" htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={personalFormData.fullName}
              onChange={handlePersonalChange}
              disabled={!isEditing}
              className="font-medium w-full p-2 border-gray-200 rounded-md focus:ring-deep-red focus:border-deep-red disabled:bg-transparent disabled:border-none"
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
              className="font-medium w-full p-2 border-gray-200 rounded-md focus:ring-deep-red focus:border-deep-red disabled:bg-transparent disabled:border-none"
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
              disabled
              className="font-medium w-full p-2 border-gray-200 rounded-md focus:ring-deep-red focus:border-deep-red disabled:bg-gray-100 disabled:border-gray-200"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600" htmlFor="ageCategory">
              Age Category
            </label>
            <input
              type="text"
              id="ageCategory"
              name="ageCategory"
              value={personalFormData.ageCategory}
              onChange={handlePersonalChange}
              disabled
              className="font-medium w-full p-2 border-gray-200 rounded-md focus:ring-deep-red focus:border-deep-red disabled:bg-gray-100 disabled:border-gray-200"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600" htmlFor="occupation">
              Occupation
            </label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              value={personalFormData.occupation}
              onChange={handlePersonalChange}
              disabled={!isEditing}
              className="font-medium w-full p-2 border-gray-200 rounded-md focus:ring-deep-red focus:border-deep-red disabled:bg-transparent disabled:border-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600" htmlFor="contact">
              Contact Number
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={personalFormData.contact}
              onChange={handlePersonalChange}
              disabled={!isEditing}
              className="font-medium w-full p-2 border-gray-200 rounded-md focus:ring-deep-red focus:border-deep-red disabled:bg-transparent disabled:border-none"
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
              className="font-medium w-full p-2 border-gray-200 rounded-md focus:ring-deep-red focus:border-deep-red disabled:bg-transparent disabled:border-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600" htmlFor="address">
              Physical Address
            </label>
            {!isEditing ? (
              <div className="font-medium w-full p-2 space-y-1">
                {addressFormData.displayAddress || "No address provided"}
              </div>
            ) : (
              <div className="space-y-3 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select
                    name="selectedRegion"
                    value={addressFormData.selectedRegion}
                    onChange={(e) => {
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
                      <option key={r.region_code} value={r.region_code}>
                        {r.region_name}
                      </option>
                    ))}
                  </select>

                  <select
                    name="selectedProvince"
                    value={addressFormData.selectedProvince}
                    onChange={(e) => {
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
                      <option key={p.province_code} value={p.province_code}>
                        {p.province_name}
                      </option>
                    ))}
                  </select>

                  <select
                    name="selectedCity"
                    value={addressFormData.selectedCity}
                    onChange={(e) => {
                      setAddressFormData((prev) => ({
                        ...prev,
                        selectedCity: e.target.value,
                        selectedBarangay: "",
                      }));
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
            <label className="text-sm text-gray-600" htmlFor="civilStatus">
              Civil Status
            </label>
            <select
              id="civilStatus"
              name="civilStatus"
              value={personalFormData.civilStatus}
              onChange={handlePersonalChange}
              disabled={!isEditing}
              className="font-medium w-full p-2 border-gray-200 rounded-md focus:ring-deep-red focus:border-deep-red disabled:bg-transparent disabled:border-none"
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
              className="font-medium w-full p-2 border-gray-200 rounded-md focus:ring-deep-red focus:border-deep-red disabled:bg-transparent disabled:border-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600" htmlFor="referralBy">
              Referral By
            </label>
            <input
              type="text"
              id="referralBy"
              name="referralBy"
              value={personalFormData.referralBy}
              onChange={handlePersonalChange}
              disabled={!isEditing}
              className="font-medium w-full p-2 border-gray-200 rounded-md focus:ring-deep-red focus:border-deep-red disabled:bg-transparent disabled:border-none"
            />
          </div>
        </div>
      </div>

      {/* Physical Attributes Column */}
      <div className="bg-gray-50 rounded-xl p-5">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
          <FaStethoscope className="mr-2 text-deep-red" />
          Physical Attributes
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Height</p>
            <p className="text-xl font-bold text-deep-red">
              {patient.height || "N/A"}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Weight</p>
            <p className="text-xl font-bold text-deep-red">
              {patient.weight || "N/A"}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Blood Type</p>
            <p className="text-xl font-bold text-deep-red">
              {patient.bloodType || "N/A"}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">BMI</p>
            <p className="text-xl font-bold text-deep-red">24.8</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsTab;
