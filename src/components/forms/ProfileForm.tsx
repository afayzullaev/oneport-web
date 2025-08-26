import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateProfileMutation, type Profile } from "@/api/profileApi";
import { useNavigate } from "react-router-dom";

const ProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const [createProfile, { isLoading }] = useCreateProfileMutation();
  const [formData, setFormData] = useState({
    type: "individual" as "individual" | "legal_entity",
    businessType: "carrier" as "carrier" | "cargo_owner",
    fullName: "",
    companyName: "",
    country: "UZ",
    address: "",
    // Individual fields
    birthDate: "",
    passportNumber: "",
    // Company fields
    representativeFullname: "",
    representativePosition: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const profileData: Partial<Profile> = {
        ...formData,
        userId: "current-user", // This will be handled by the backend based on the auth token
      };

      await createProfile(profileData).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Создание профиля</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Profile Type */}
        <div>
          <label className="block text-sm font-medium mb-4">Тип профиля</label>
          <div className="flex gap-6 justify-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="type"
                value="individual"
                checked={formData.type === "individual"}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 mr-3"
              />
              <span>Физическое лицо</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="type"
                value="legal_entity"
                checked={formData.type === "legal_entity"}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 mr-3"
              />
              <span>Юридическое лицо</span>
            </label>
          </div>
        </div>

        {/* Business Type */}
        <div>
          <label className="block text-sm font-medium mb-4">Тип деятельности</label>
          <div className="flex gap-6 justify-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="businessType"
                value="carrier"
                checked={formData.businessType === "carrier"}
                onChange={(e) => handleInputChange("businessType", e.target.value)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 mr-3"
              />
              <span>Перевозчик</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="businessType"
                value="cargo_owner"
                checked={formData.businessType === "cargo_owner"}
                onChange={(e) => handleInputChange("businessType", e.target.value)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 mr-3"
              />
              <span>Грузовладелец</span>
            </label>
          </div>
        </div>

        {/* Individual or Company Name */}
        {formData.type === "individual" ? (
          <div>
            <label className="block text-sm font-medium mb-2">Полное имя *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2">Название компании *</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-2">Страна</label>
          <select
            value={formData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="UZ">Узбекистан</option>
            <option value="RU">Россия</option>
            <option value="KZ">Казахстан</option>
            <option value="KG">Кыргызстан</option>
            <option value="TJ">Таджикистан</option>
          </select>
        </div>

        {/* Additional fields based on profile type */}
        {formData.type === "individual" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Дата рождения</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Номер паспорта</label>
              <input
                type="text"
                value={formData.passportNumber}
                onChange={(e) => handleInputChange("passportNumber", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Поля необязательное"
              />
            </div>
          </>
        )}

        {formData.type === "legal_entity" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">ФИО представителя</label>
              <input
                type="text"
                value={formData.representativeFullname}
                onChange={(e) =>
                  handleInputChange("representativeFullname", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Должность представителя
              </label>
              <input
                type="text"
                value={formData.representativePosition}
                onChange={(e) =>
                  handleInputChange("representativePosition", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 text-lg"
        >
          {isLoading ? "Создание профиля..." : "Создать профиль"}
        </Button>
      </form>
    </div>
  );
};

export default ProfileForm;
