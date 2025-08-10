// src/hooks/useLocalization.ts
import { useAppSelector } from "./useAppSelector";
import type { LocalizedString } from "../types/models/cargoOwner/order";
import type { SupportedLanguage } from "../store/languageSlice";
import { translations, type Translations } from "../locales/translations";

export const useLocalization = () => {
  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage
  );

  // Получаем переводы для текущего языка
  const t: Translations = translations[currentLanguage];

  const getLocalizedText = (
    localized: LocalizedString,
    fallback: string = t.common.notSpecified
  ): string => {
    if (!localized) return fallback;

    // Сначала пытаемся получить текст на выбранном языке
    const text = localized[currentLanguage];
    if (text) return text;

    // Fallback chain: ru -> en -> uz -> kz -> kaa -> fallback
    return (
      localized.ru ||
      localized.en ||
      localized.uz ||
      localized.kz ||
      localized.kaa ||
      fallback
    );
  };

  const formatLanguageName = (lang: SupportedLanguage): string => {
    const names = {
      ru: "Русский",
      en: "English",
      uz: "O'zbek",
      kz: "Қазақ",
      kaa: "Qaraqalpaq",
    };
    return names[lang];
  };

  // Хелперы для форматирования
  const formatWeight = (weight: number, unit: string): string => {
    if (typeof weight !== "number" || isNaN(weight))
      return t.common.notSpecified;
    const unitText = unit === "kg" ? t.common.kg : t.common.ton;
    return `${weight} ${unitText}`;
  };

  const formatPrice = (pricing?: any): string => {
    if (!pricing) return t.common.notSpecified;
    if (pricing.withVat) {
      return `${pricing.withVat.toLocaleString()} ${t.common.som} (${
        t.common.withVat
      })`;
    }
    if (pricing.withoutVat) {
      return `${pricing.withoutVat.toLocaleString()} ${t.common.som} (${
        t.common.withoutVat
      })`;
    }
    return t.common.negotiable;
  };

  return {
    currentLanguage,
    t, // Объект переводов
    getLocalizedText,
    formatLanguageName,
    formatWeight,
    formatPrice,
  };
};
