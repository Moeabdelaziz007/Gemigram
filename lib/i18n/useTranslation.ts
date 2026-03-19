import { create } from 'zustand';

interface TranslationState {
  locale: 'en' | 'ar';
  setLocale: (locale: 'en' | 'ar') => void;
}

export const useLocaleStore = create<TranslationState>((set) => ({
  locale: 'en',
  setLocale: (locale) => set({ locale }),
}));

const translations = {
  en: {
    dashboard: 'Dashboard',
    workspace: 'Workspace',
    forge: 'Forge',
    hub: 'Hub',
    settings: 'Settings',
    credits: 'Credits',
    voice_active: 'Neural Link Active',
    listening: 'Listening...',
    thinking: 'Interpreting Intent...',
    executing: 'Executing Protocol...',
  },
  ar: {
    dashboard: 'قمرة القيادة',
    workspace: 'مساحة العمل',
    forge: 'المصنع',
    hub: 'المركز',
    settings: 'الإعدادات',
    credits: 'الرصيد',
    voice_active: 'الرابط العصبي نشط',
    listening: 'جاري الاستماع...',
    thinking: 'جاري تفسير القصد...',
    executing: 'جاري تنفيذ البروتوكول...',
  }
};

export function useTranslation() {
  const { locale } = useLocaleStore();
  
  const t = (key: keyof typeof translations.en) => {
    return translations[locale][key] || key;
  };

  const isRTL = locale === 'ar';

  return { t, locale, isRTL };
}
