/**
 * FloraIQ i18n — lightweight, dependency-free internationalization.
 *
 * 13 languages covering every continent and ~5 billion first/second-language
 * speakers. UI chrome (navigation, common actions) is translated from this
 * dictionary; AI-generated content is translated server-side via the
 * `?lang=` parameter on /api/identify and /api/chat.
 *
 * Usage:
 *   const t = useT();            // inside components
 *   t("nav.home")                // → "Home" / "Inicio" / "首页" / …
 *   getLang()                    // outside React (fetch params, etc.)
 *
 * Adding a language: add one entry to SUPPORTED_LANGUAGES and one column to
 * MESSAGES. Missing keys fall back to English automatically.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface Language {
  code: string;        // BCP-47 primary subtag
  name: string;        // English name
  native: string;      // endonym, shown in pickers
  rtl?: boolean;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English",    native: "English" },
  { code: "es", name: "Spanish",    native: "Español" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "fr", name: "French",     native: "Français" },
  { code: "de", name: "German",     native: "Deutsch" },
  { code: "ru", name: "Russian",    native: "Русский" },
  { code: "ar", name: "Arabic",     native: "العربية", rtl: true },
  { code: "hi", name: "Hindi",      native: "हिन्दी" },
  { code: "zh", name: "Chinese",    native: "中文" },
  { code: "ja", name: "Japanese",   native: "日本語" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia" },
  { code: "ms", name: "Malay",      native: "Bahasa Melayu" },
  { code: "sw", name: "Swahili",    native: "Kiswahili" },
];

type MessageKey =
  | "nav.home" | "nav.library" | "nav.identify" | "nav.garden" | "nav.me"
  | "common.search" | "common.loading" | "common.save" | "common.cancel"
  | "common.retry" | "common.close" | "common.language"
  | "scan.analyzing" | "scan.retake"
  | "weather.title" | "weather.myLocation";

const MESSAGES: Record<string, Partial<Record<MessageKey, string>>> = {
  en: {
    "nav.home": "Home", "nav.library": "Library", "nav.identify": "Identify",
    "nav.garden": "Garden", "nav.me": "Me",
    "common.search": "Search", "common.loading": "Loading…", "common.save": "Save",
    "common.cancel": "Cancel", "common.retry": "Retry", "common.close": "Close",
    "common.language": "Language",
    "scan.analyzing": "Analyzing…", "scan.retake": "Retake",
    "weather.title": "Weather Intelligence", "weather.myLocation": "My location",
  },
  es: {
    "nav.home": "Inicio", "nav.library": "Biblioteca", "nav.identify": "Identificar",
    "nav.garden": "Jardín", "nav.me": "Yo",
    "common.search": "Buscar", "common.loading": "Cargando…", "common.save": "Guardar",
    "common.cancel": "Cancelar", "common.retry": "Reintentar", "common.close": "Cerrar",
    "common.language": "Idioma",
    "scan.analyzing": "Analizando…", "scan.retake": "Repetir",
    "weather.title": "Inteligencia meteorológica", "weather.myLocation": "Mi ubicación",
  },
  pt: {
    "nav.home": "Início", "nav.library": "Biblioteca", "nav.identify": "Identificar",
    "nav.garden": "Jardim", "nav.me": "Eu",
    "common.search": "Pesquisar", "common.loading": "Carregando…", "common.save": "Salvar",
    "common.cancel": "Cancelar", "common.retry": "Tentar novamente", "common.close": "Fechar",
    "common.language": "Idioma",
    "scan.analyzing": "Analisando…", "scan.retake": "Repetir",
    "weather.title": "Inteligência meteorológica", "weather.myLocation": "Minha localização",
  },
  fr: {
    "nav.home": "Accueil", "nav.library": "Bibliothèque", "nav.identify": "Identifier",
    "nav.garden": "Jardin", "nav.me": "Moi",
    "common.search": "Rechercher", "common.loading": "Chargement…", "common.save": "Enregistrer",
    "common.cancel": "Annuler", "common.retry": "Réessayer", "common.close": "Fermer",
    "common.language": "Langue",
    "scan.analyzing": "Analyse…", "scan.retake": "Reprendre",
    "weather.title": "Intelligence météo", "weather.myLocation": "Ma position",
  },
  de: {
    "nav.home": "Start", "nav.library": "Bibliothek", "nav.identify": "Erkennen",
    "nav.garden": "Garten", "nav.me": "Ich",
    "common.search": "Suchen", "common.loading": "Lädt…", "common.save": "Speichern",
    "common.cancel": "Abbrechen", "common.retry": "Erneut versuchen", "common.close": "Schließen",
    "common.language": "Sprache",
    "scan.analyzing": "Analysiere…", "scan.retake": "Wiederholen",
    "weather.title": "Wetter-Intelligenz", "weather.myLocation": "Mein Standort",
  },
  ru: {
    "nav.home": "Главная", "nav.library": "Библиотека", "nav.identify": "Определить",
    "nav.garden": "Сад", "nav.me": "Я",
    "common.search": "Поиск", "common.loading": "Загрузка…", "common.save": "Сохранить",
    "common.cancel": "Отмена", "common.retry": "Повторить", "common.close": "Закрыть",
    "common.language": "Язык",
    "scan.analyzing": "Анализ…", "scan.retake": "Переснять",
    "weather.title": "Погодная аналитика", "weather.myLocation": "Моё местоположение",
  },
  ar: {
    "nav.home": "الرئيسية", "nav.library": "المكتبة", "nav.identify": "تعرّف",
    "nav.garden": "الحديقة", "nav.me": "أنا",
    "common.search": "بحث", "common.loading": "جارٍ التحميل…", "common.save": "حفظ",
    "common.cancel": "إلغاء", "common.retry": "إعادة المحاولة", "common.close": "إغلاق",
    "common.language": "اللغة",
    "scan.analyzing": "جارٍ التحليل…", "scan.retake": "إعادة التصوير",
    "weather.title": "ذكاء الطقس", "weather.myLocation": "موقعي",
  },
  hi: {
    "nav.home": "होम", "nav.library": "पुस्तकालय", "nav.identify": "पहचानें",
    "nav.garden": "बगीचा", "nav.me": "मैं",
    "common.search": "खोजें", "common.loading": "लोड हो रहा है…", "common.save": "सहेजें",
    "common.cancel": "रद्द करें", "common.retry": "पुनः प्रयास", "common.close": "बंद करें",
    "common.language": "भाषा",
    "scan.analyzing": "विश्लेषण हो रहा है…", "scan.retake": "फिर से लें",
    "weather.title": "मौसम इंटेलिजेंस", "weather.myLocation": "मेरा स्थान",
  },
  zh: {
    "nav.home": "首页", "nav.library": "图鉴", "nav.identify": "识别",
    "nav.garden": "花园", "nav.me": "我",
    "common.search": "搜索", "common.loading": "加载中…", "common.save": "保存",
    "common.cancel": "取消", "common.retry": "重试", "common.close": "关闭",
    "common.language": "语言",
    "scan.analyzing": "分析中…", "scan.retake": "重拍",
    "weather.title": "天气智能", "weather.myLocation": "我的位置",
  },
  ja: {
    "nav.home": "ホーム", "nav.library": "図鑑", "nav.identify": "識別",
    "nav.garden": "ガーデン", "nav.me": "マイ",
    "common.search": "検索", "common.loading": "読み込み中…", "common.save": "保存",
    "common.cancel": "キャンセル", "common.retry": "再試行", "common.close": "閉じる",
    "common.language": "言語",
    "scan.analyzing": "解析中…", "scan.retake": "撮り直す",
    "weather.title": "天気インテリジェンス", "weather.myLocation": "現在地",
  },
  id: {
    "nav.home": "Beranda", "nav.library": "Pustaka", "nav.identify": "Identifikasi",
    "nav.garden": "Kebun", "nav.me": "Saya",
    "common.search": "Cari", "common.loading": "Memuat…", "common.save": "Simpan",
    "common.cancel": "Batal", "common.retry": "Coba lagi", "common.close": "Tutup",
    "common.language": "Bahasa",
    "scan.analyzing": "Menganalisis…", "scan.retake": "Ulangi",
    "weather.title": "Intelijen Cuaca", "weather.myLocation": "Lokasi saya",
  },
  ms: {
    "nav.home": "Utama", "nav.library": "Perpustakaan", "nav.identify": "Kenal pasti",
    "nav.garden": "Taman", "nav.me": "Saya",
    "common.search": "Cari", "common.loading": "Memuatkan…", "common.save": "Simpan",
    "common.cancel": "Batal", "common.retry": "Cuba lagi", "common.close": "Tutup",
    "common.language": "Bahasa",
    "scan.analyzing": "Menganalisis…", "scan.retake": "Ambil semula",
    "weather.title": "Kecerdasan Cuaca", "weather.myLocation": "Lokasi saya",
  },
  sw: {
    "nav.home": "Nyumbani", "nav.library": "Maktaba", "nav.identify": "Tambua",
    "nav.garden": "Bustani", "nav.me": "Mimi",
    "common.search": "Tafuta", "common.loading": "Inapakia…", "common.save": "Hifadhi",
    "common.cancel": "Ghairi", "common.retry": "Jaribu tena", "common.close": "Funga",
    "common.language": "Lugha",
    "scan.analyzing": "Inachanganua…", "scan.retake": "Piga tena",
    "weather.title": "Akili ya Hali ya Hewa", "weather.myLocation": "Mahali nilipo",
  },
};

const STORAGE_KEY = "floraiq_lang_code";

function detectLang(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && MESSAGES[stored]) return stored;
    const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    if (MESSAGES[nav]) return nav;
  } catch { /* SSR / privacy mode */ }
  return "en";
}

// Module-level current language so non-React code (fetch params) can read it.
let currentLang = "en";
export function getLang(): string {
  return currentLang;
}

interface I18nContextValue {
  lang: string;
  setLang: (code: string) => void;
  t: (key: MessageKey) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<string>(detectLang);

  useEffect(() => {
    currentLang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* ignore */ }
    const meta = SUPPORTED_LANGUAGES.find(l => l.code === lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = meta?.rtl ? "rtl" : "ltr";
  }, [lang]);

  const t = (key: MessageKey): string =>
    MESSAGES[lang]?.[key] ?? MESSAGES.en[key] ?? key;

  return (
    <I18nContext.Provider value={{ lang, setLang: setLangState, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function useT() {
  return useI18n().t;
}
