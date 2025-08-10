// src/store/languageSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SupportedLanguage = "ru" | "en" | "uz" | "kz" | "kaa";

export interface LanguageState {
  currentLanguage: SupportedLanguage;
}

// Получаем язык из localStorage или используем русский по умолчанию
const getInitialLanguage = (): SupportedLanguage => {
  const saved = localStorage.getItem("selectedLanguage");
  if (saved && ["ru", "en", "uz", "kz", "kaa"].includes(saved)) {
    return saved as SupportedLanguage;
  }
  return "ru"; // По умолчанию русский
};

const languageSlice = createSlice({
  name: "language",
  initialState: {
    currentLanguage: getInitialLanguage(),
  } as LanguageState,
  reducers: {
    setLanguage: (state, action: PayloadAction<SupportedLanguage>) => {
      state.currentLanguage = action.payload;
      // Сохраняем в localStorage для персистентности
      localStorage.setItem("selectedLanguage", action.payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
