import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import "intl-pluralrules";

// Import translation files
import en from "../locales/en.json";
import fr from "../locales/fr.json";

const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
};

const locales = Localization.getLocales();
const languageTag = locales && locales.length > 0 ? locales[0].languageTag : "en-US";
const extractedLng = languageTag.split("-")[0];

i18n.use(initReactI18next).init({
  resources,
  lng: extractedLng, // Get language code (e.g., 'en' from 'en-US')
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
