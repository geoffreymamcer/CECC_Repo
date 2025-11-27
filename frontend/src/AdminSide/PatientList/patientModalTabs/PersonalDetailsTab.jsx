import React from "react";
import { FaFileMedical, FaStethoscope } from "react-icons/fa";

const PersonalDetailsTab = ({
  isEditing,
  personalFormData,
  addressFormData,
  handlePersonalChange,
  handleAddressChange,
  setAddressFormData,
  filteredProvinces,
  filteredCities,
  filteredBarangays,
  regions,
  provinces,
  cities,
  barangays,
}) => {
  return (
    <div className="animate-fadeIn">
      {/* Personal Information Section */}
      <div className="bg-gray-50 rounded-xl p-5">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center">
          <FaFileMedical className="mr-2 text-deep-red" />
          Personal Information
        </h4>

        {/* 3️⃣ START: Reorganized form fields into a responsive two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Full Name - Spanning two columns for more space */}
          <div className="md:col-span-2">
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
              className="font-medium w-full p-2 border border-gray-200 rounded-md focus:ring-deep-red focus:border-deep-red disabled:bg-transparent disabled:border-none disabled:p-2"
            />
          </div>

          {/* Date of Birth */}
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
              className="font-medium w-full p-2 border border-gray-200 rounded-md focus:ring-deep-red focus:border-deep-red disabled:bg-transparent disabled:border-none disabled:p-2"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm text-gray-600" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={personalFormData.gender}
              onChange={handlePersonalChange}
              disabled={!isEditing}
              className="font-medium w-full p-2 border border-gray-200 rounded-md focus:ring-deep-red focus:border-deep-red disabled:bg-transparent disabled:border-none disabled:p-2"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Age (Read-only) */}
          <div>
            <label className="text-sm text-gray-600" htmlFor="age">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={personalFormData.age}
              readOnly
              className="font-medium w-full p-2 border-gray-200 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Age Category (Read-only) */}
          <div>
            <label className="text-sm text-gray-600" htmlFor="ageCategory">
              Age Category
            </label>
            <input
              type="text"
              id="ageCategory"
              name="ageCategory"
              value={personalFormData.ageCategory}
              readOnly
              className="font-medium w-full p-2 border-gray-200 rounded-md bg-gray-100 cursor-not-allowed"
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
              value={personalFormData.phone_number}
              onChange={handlePersonalChange}
              disabled={!isEditing}
              className="font-medium w-full p-2 border border-gray-200 rounded-md focus:ring-deep-red focus:border-deep-red disabled:bg-transparent disabled:border-none disabled:p-2"
            />
          </div>

          {/* Email Address */}
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
              className="font-medium w-full p-2 border border-gray-200 rounded-md focus:ring-deep-red focus:border-deep-red disabled:bg-transparent disabled:border-none disabled:p-2"
            />
          </div>

          {/* Occupation */}
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
              className="font-medium w-full p-2 border border-gray-200 rounded-md focus:ring-deep-red focus:border-deep-red disabled:bg-transparent disabled:border-none disabled:p-2"
            />
          </div>

          {/* Civil Status */}
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
              className="font-medium w-full p-2 border border-gray-200 rounded-md focus:ring-deep-red focus:border-deep-red disabled:bg-transparent disabled:border-none disabled:p-2"
            >
              <option value="">Select Civil Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>

          {/* Referral By - Spanning two columns */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600" htmlFor="referralBy">
              Referred By
            </label>
            <input
              type="text"
              id="referralBy"
              name="referralBy"
              value={personalFormData.referralBy}
              onChange={handlePersonalChange}
              disabled={!isEditing}
              className="font-medium w-full p-2 border border-gray-200 rounded-md focus:ring-deep-red focus:border-deep-red disabled:bg-transparent disabled:border-none disabled:p-2"
            />
          </div>

          {/* Physical Address Section - Spanning two columns */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600" htmlFor="address">
              Physical Address
            </label>
            {!isEditing ? (
              <div className="font-medium w-full p-2">
                {addressFormData.displayAddress || "No address provided"}
              </div>
            ) : (
              <div className="space-y-3 mt-2 p-4 border rounded-lg bg-white">
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
                    disabled={!addressFormData.selectedRegion}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl disabled:bg-gray-100"
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
                    disabled={!addressFormData.selectedProvince}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl disabled:bg-gray-100"
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
                    disabled={!addressFormData.selectedCity}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl disabled:bg-gray-100"
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
        </div>
        {/* 3️⃣ END: Reorganized form fields */}
      </div>
    </div>
  );
};

export default PersonalDetailsTab;
