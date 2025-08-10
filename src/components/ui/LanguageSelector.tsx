// src/components/ui/LanguageSelector.tsx
import React from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useLocalization } from "../../hooks/useLocalization";
import { setLanguage, type SupportedLanguage } from "../../store/languageSlice";

const LanguageSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentLanguage, formatLanguageName } = useLocalization();

  const languages: SupportedLanguage[] = ["ru", "en", "uz", "kz", "kaa"];

  const handleLanguageChange = (lang: SupportedLanguage) => {
    dispatch(setLanguage(lang));
  };

  return (
    <div className="relative inline-block text-left">
      <select
        value={currentLanguage}
        onChange={(e) =>
          handleLanguageChange(e.target.value as SupportedLanguage)
        }
        className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {formatLanguageName(lang)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
