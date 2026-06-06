import React, { createContext, useContext, useState } from 'react';

export type Locale = 'en' | 'hi' | 'mr';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Locale, string>> = {
  // Navigation
  "nav.services": { en: "Services", hi: "सेवाएं", mr: "सेवा" },
  "nav.howItWorks": { en: "How it Works", hi: "यह कैसे काम करता है", mr: "हे कसे कार्य करते" },

  // Hero
  "hero.topBadge": { en: "India's #1 Rated Local Experts", hi: "भारत के #1 रेटेड स्थानीय विशेषज्ञ", mr: "भारतातील #1 रेटेड स्थानिक तज्ञ" },
  "hero.title1": { en: "Expert Repairs,", hi: "विशेषज्ञ मरम्मत,", mr: "तज्ञ दुरुस्ती," },
  "hero.title2": { en: "Delivered Fast.", hi: "तेजी से दिया गया।", mr: "जलद वितरीत." },
  "hero.subtitle": { 
    en: "Book verified Electricians, Plumbers, and Appliance technicians in 60 seconds. Featuring live tracking and transparent upfront pricing.", 
    hi: "60 सेकंड में सत्यापित इलेक्ट्रीशियन, प्लंबर और उपकरण तकनीशियनों को बुक करें। लाइव ट्रैकिंग और पारदर्शी अपफ्रंट मूल्य निर्धारण।", 
    mr: "60 सेकंदात सत्यापित इलेक्ट्रीशियन, प्लंबर आणि उपकरणे तंत्रज्ञ बुक करा. थेट ट्रॅकिंग आणि पारदर्शक अपफ्रंट किंमतीसह." 
  },
  "hero.searchPlaceholder": { en: "Search for 'AC Repair'...", hi: "'एसी रिपेयर' खोजें...", mr: "'एसी रिपेअर' शोधा..." },
  "hero.findBtn": { en: "Find", hi: "खोजें", mr: "शोधा" },
  "hero.rating": { en: "4.9/5 Average Rating", hi: "4.9/5 औसत रेटिंग", mr: "4.9/5 सरासरी रेटिंग" },
  "hero.homes": { en: "From 50k+ Indian homes", hi: "50,000+ भारतीय घरों से", mr: "50,000+ भारतीय घरांमधून" },

  // Services
  "services.title": { en: "Our Services", hi: "हमारी सेवाएं", mr: "आमच्या सेवा" },
  "services.subtitle": { en: "Quality work, guaranteed.", hi: "गुणवत्तापूर्ण काम, गारंटीकृत।", mr: "दर्जेदार कामाची हमी." },
  "services.viewAll": { en: "View All Services", hi: "सभी सेवाएं देखें", mr: "सर्व सेवा पहा" },
  "services.startsFrom": { en: "Starts From", hi: "शुरुआती कीमत", mr: "सुरुवातीची किंमत" },

  // How it works
  "how.title": { en: "How Servico Works", hi: "सर्विको कैसे काम करता है", mr: "सर्विको कसे कार्य करते" },
  "how.subtitle": { en: "A seamless experience from booking to billing. We have streamlined local services with cutting-edge tech.", hi: "बुकिंग से बिलिंग तक एक सहज अनुभव।", mr: "बुकिंगपासून बिलिंगपर्यंत एक अखंड अनुभव." },
  "how.step1.title": { en: "Select Service", hi: "सेवा चुनें", mr: "सेवा निवडा" },
  "how.step1.desc": { en: "Choose the service you need from our extensive catalog.", hi: "सटीक सेवा चुनें जो आपको चाहिए।", mr: "तुम्हाला आवश्यक असलेली सेवा निवडा." },
  "how.step2.title": { en: "Confirm & Book", hi: "पुष्टि करें और बुक करें", mr: "निश्चित करा आणि बुक करा" },
  "how.step2.desc": { en: "Verify with secure OTP and complete payment via safe UPI gateways.", hi: "सुरक्षित ओटीपी के साथ सत्यापित करें।", mr: "सुरक्षित ओटीपी सह सत्यापित करा." },
  "how.step3.title": { en: "Live Tracking", hi: "लाइव ट्रैकिंग", mr: "थेट ट्रॅकिंग" },
  "how.step3.desc": { en: "Track your assigned technician in real-time.", hi: "वास्तविक समय में अपने तकनीशियन को ट्रैक करें।", mr: "तुमच्या तंत्रज्ञाचा रिअल-टाइममध्ये मागोवा घ्या." },
  "how.step4.title": { en: "Instant Invoice", hi: "त्वरित चालान", mr: "त्वरित बीजक" },
  "how.step4.desc": { en: "Get a detailed GST invoice immediately upon completion.", hi: "सेवा पूरी होने पर चालान प्राप्त करें।", mr: "सेवा पूर्ण झाल्यावर ताबडतोब बीजक मिळवा." },

  // Sections
  "trust.title": { en: "Trust & Safety Platform", hi: "ट्रस्ट और सुरक्षा मंच", mr: "विश्वास आणि सुरक्षा प्लॅटफॉर्म" },
  "trust.subtitle": { en: "We take the risk out of home services.", hi: "हम घरेलू सेवाओं से जोखिम निकालते हैं।", mr: "आम्ही घरगुती सेवांमधून धोका दूर करतो." },
  
  "results.title": { en: "Real Results", hi: "वास्तविक परिणाम", mr: "खरे परिणाम" },
  "results.subtitle": { en: "Drag to see the incredible transformation.", hi: "परिवर्तन देखने के लिए खींचें।", mr: "बदल पाहण्यासाठी ड्रॅग करा." },

  "testimonials.title": { en: "What Our Customers Say", hi: "हमारे ग्राहक क्या कहते हैं", mr: "आमचे ग्राहक काय म्हणतात" },
  "testimonials.subtitle": { en: "Real reviews from verified home service bookings across local neighborhoods.", hi: "स्थानीय आस-पड़ोस में सत्यापित होम सर्विस बुकिंग की वास्तविक समीक्षा।", mr: "स्थानिक अतिपरिचित क्षेत्रांमधील सत्यापित घर सेवा बुकिंगचे वास्तविक पुनरावलोकने." },
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  const t = (key: string) => {
    return translations[key]?.[locale] || translations[key]?.['en'] || key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
