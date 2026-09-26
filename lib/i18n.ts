import en from '@/locales/en.json';
import es from '@/locales/es.json';
import * as Localization from 'expo-localization';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const SUPPORTED_LANGUAGES = ['en', 'es'] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

function isSupportedLanguage(value: string | undefined): value is SupportedLanguage {
    return (SUPPORTED_LANGUAGES as readonly string[]).includes(value ?? '');
}

const deviceLanguageCode = Localization.getLocales()[0]?.languageCode ?? undefined;
const initialLanguage: SupportedLanguage = isSupportedLanguage(deviceLanguageCode)
    ? deviceLanguageCode
    : 'en';

i18next.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        es: { translation: es },
    },
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

export default i18next;
