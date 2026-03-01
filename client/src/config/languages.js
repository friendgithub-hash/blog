export const languages = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    dir: "ltr",
    flag: "🇺🇸",
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    dir: "ltr",
    flag: "🇪🇸",
  },
  {
    code: "zh-CN",
    name: "Chinese (Simplified)",
    nativeName: "简体中文",
    dir: "ltr",
    flag: "🇨🇳",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    dir: "rtl",
    flag: "🇸🇦",
  },
];

export const getLanguageByCode = (code) => {
  return languages.find((lang) => lang.code === code) || languages[0];
};

export const isRTL = (code) => {
  const lang = getLanguageByCode(code);
  return lang.dir === "rtl";
};
