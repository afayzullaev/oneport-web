import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useCreateProfileMutation,
  type Profile,
} from "@/api/profileApi";
import { useNavigate } from "react-router-dom";

const ProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const [createProfile, { isLoading }] = useCreateProfileMutation();
  const [formData, setFormData] = useState({
    type: "individual" as "individual" | "legal_entity",
    businessType: "carrier" as "carrier" | "cargo_owner",
    fullName: "",
    companyName: "",
    phoneNumbers: [""],
    emails: [""],
    country: "UZ",
    postalCode: "",
    address: "",
    description: "",
    // Individual fields
    birthDate: "",
    passportNumber: "",
    // Company fields
    companyTIN: "",
    companyRegistrationNumber: "",
    representativeFullname: "",
    representativePosition: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayInputChange = (
    field: "phoneNumbers" | "emails",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayField = (field: "phoneNumbers" | "emails") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (
    field: "phoneNumbers" | "emails",
    index: number
  ) => {
    if (formData[field].length > 1) {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Filter out empty strings from arrays
      const profileData: Partial<Profile> = {
        ...formData,
        phoneNumbers: formData.phoneNumbers.filter((phone) => phone.trim()),
        emails: formData.emails.filter((email) => email.trim()),
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Тип профиля</label>
          <select
            value={formData.type}
            onChange={(e) => handleInputChange("type", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="individual">Физическое лицо</option>
            <option value="legal_entity">Юридическое лицо</option>
          </select>
        </div>

        {/* Business Type */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Тип деятельности
          </label>
          <select
            value={formData.businessType}
            onChange={(e) => handleInputChange("businessType", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="carrier">Перевозчик</option>
            <option value="cargo_owner">Грузовладелец</option>
          </select>
        </div>

        {/* Individual or Company Name */}
        {formData.type === "individual" ? (
          <div>
            <label className="block text-sm font-medium mb-2">
              Полное имя *
            </label>
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
            <label className="block text-sm font-medium mb-2">
              Название компании *
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}

        {/* Phone Numbers */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Номера телефонов *
          </label>
          {formData.phoneNumbers.map((phone, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  handleArrayInputChange("phoneNumbers", index, e.target.value)
                }
                placeholder="+998901234567"
                className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={index === 0}
              />
              {formData.phoneNumbers.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeArrayField("phoneNumbers", index)}
                  variant="outline"
                  className="px-3"
                >
                  ✕
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            onClick={() => addArrayField("phoneNumbers")}
            variant="outline"
            className="mt-2"
          >
            + Добавить номер
          </Button>
        </div>

        {/* Email Addresses */}
        <div>
          <label className="block text-sm font-medium mb-2">Email адреса</label>
          {formData.emails.map((email, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="email"
                value={email}
                onChange={(e) =>
                  handleArrayInputChange("emails", index, e.target.value)
                }
                placeholder="example@email.com"
                className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.emails.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeArrayField("emails", index)}
                  variant="outline"
                  className="px-3"
                >
                  ✕
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            onClick={() => addArrayField("emails")}
            variant="outline"
            className="mt-2"
          >
            + Добавить email
          </Button>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium mb-2">
              Почтовый индекс *
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Адрес *</label>
          <textarea
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Additional fields based on profile type */}
        {formData.type === "individual" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">
                Дата рождения
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Номер паспорта
              </label>
              <input
                type="text"
                value={formData.passportNumber}
                onChange={(e) =>
                  handleInputChange("passportNumber", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {formData.type === "legal_entity" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">
                ИНН компании
              </label>
              <input
                type="text"
                value={formData.companyTIN}
                onChange={(e) =>
                  handleInputChange("companyTIN", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Регистрационный номер
              </label>
              <input
                type="text"
                value={formData.companyRegistrationNumber}
                onChange={(e) =>
                  handleInputChange("companyRegistrationNumber", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                ФИО представителя
              </label>
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

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Описание</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={4}
            placeholder="Расскажите о себе или своей компании..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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
