import { useState, useRef } from "react";
import {
  Power,
  Droplets,
  Wrench,
  Search,
  Star,
  MapPin,
  ShieldCheck,
  Clock,
  CheckCircle,
  Bug,
  Sparkles,
  ChevronRight,
  History,
  Filter,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LightBeamButton } from "./components/LightBeamButton";
import { TiltCard } from "./components/TiltCard";
import { BookingWizard } from "./components/BookingWizard";
import { UserProfile } from "./components/UserProfile";
import { LiveActivityFeed } from "./components/LiveActivityFeed";
import { useLocale, Locale } from "./LocaleContext";
import { BeforeAfterSlider } from "./components/BeforeAfterSlider";
import { TrustSafetyGrid } from "./components/TrustSafetyGrid";
import { LoyaltyRewards } from "./components/LoyaltyRewards";
import { PartnersMarquee } from "./components/PartnersMarquee";
import { FloatingAI } from "./components/FloatingAI";
import { AmbientBackground } from "./components/AmbientBackground";
import { ExpandableTechnician } from "./components/ExpandableTechnician";
import { TestimonialSlider } from "./components/TestimonialSlider";
import { ScrollProgress } from "./components/ScrollProgress";
import { FooterMap } from "./components/FooterMap";
import { NewsletterSignup } from "./components/NewsletterSignup";
import { NagpurServiceArea } from "./components/NagpurServiceArea";
import { PromoBanner } from "./components/PromoBanner";
import { TopTechniciansChart } from "./components/TopTechniciansChart";
import type { ServiceCategory } from "./types";

import imgElectrician from "./assets/images/regenerated_image_1780596280974.png";
import imgCleaner from "./assets/images/regenerated_image_1780596334553.png";
import imgPestControl from "./assets/images/regenerated_image_1780596496168.png";
import imgAppliance from "./assets/images/regenerated_image_1780596921634.png";
import imgPlumber from "./assets/images/regenerated_image_1780596641118.png";

const SERVICES: ServiceCategory[] = [
  {
    id: "1",
    name: "Electrician",
    description: "Wiring, MCB, Inverter, Fan repair & installations.",
    icon: "Power",
    iconName: "⚡",
    basePrice: 249,
    image: imgElectrician,
    avatar: "Vidyut",
    color: "#ff9933",
    technician: {
      name: "Vidyut",
      experience: "8 Years",
      rating: 4.8,
      jobsCompleted: 1250,
      certifications: ["Govt Certified Electrician", "Safety First"],
      videoUrl:
         "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-smiling-man-with-a-beard-39674-large.mp4",
      activeZone: "Koradi, Dharampeth, Sadar, Ramdaspeth, Civil Lines, Nagpur",
    },
  },
  {
    id: "2",
    name: "Plumber",
    description: "Leakages, Tap fix, Washbasin, Pipes & Tank cleaning. ",
    icon: "Droplets",
    iconName: "🔧",
    basePrice: 199,
    image: imgPlumber,
    avatar: "Neer",
    color: "#00ccff",
    technician: {
      name: "Neer",
      experience: "5 Years",
      rating: 4.7,
      jobsCompleted: 850,
      certifications: ["Advanced Plumbing", "Water Conservation"],
      activeZone: "Medical Chowk, Sitabuldi, Laxmi Nagar, Pratap Nagar, Nagpur",
    },
  },
  {
    id: "3",
    name: "Appliance Repair",
    description: "AC, Refrigerator, Washing Machine, Microwave fixes.",
    icon: "Wrench",
    iconName: "🏗️",
    basePrice: 349,
    image: imgAppliance,
    avatar: "Nirman",
    color: "#f59e0b",
    technician: {
      name: "Nirman",
      experience: "12 Years",
      rating: 4.9,
      jobsCompleted: 2100,
      certifications: ["LG/Samsung Certified", "Cooling Systems"],
      activeZone: "Bhanegao, Wardhaman Nagar, Itwari, Ganeshpeth, Nagpur",
    },
  },
  {
    id: "4",
    name: "Pest Control",
    description: "Termite, Bedbugs, Cockroach, and Mosquito control.",
    icon: "Bug",
    iconName: "🛡️",
    basePrice: 499,
    image: imgPestControl,
    avatar: "Rakshak",
    color: "#14b8a6",
    technician: {
      name: "Rakshak",
      experience: "6 Years",
      rating: 4.6,
      jobsCompleted: 1020,
      certifications: ["Chemical Safety Cert", "Exterminator Pro"],
      activeZone: "Khaparkheda, Sadar, Civil Lines, Koradi, Nagpur",
    },
  },
  {
    id: "5",
    name: "Deep Cleaning",
    description: "Full home cleaning, sofa, bathroom, and kitchen.",
    icon: "Sparkles",
    iconName: "✨",
    basePrice: 999,
    image: imgCleaner,
    avatar: "Swachh",
    color: "#ffffff",
    technician: {
      name: "Swachh",
      experience: "4 Years",
      rating: 4.9,
      jobsCompleted: 1540,
      certifications: ["Bio-Cleaning", "Home Hygiene Standards"],
      activeZone: "Wadi, Manish Nagar, Hingna, Trimurti Nagar, Besa, Khamla, Nagpur",
    },
  },
];

const STEPS = [
  {
    title: "Select Service",
    description:
      "Choose the service you need from our extensive catalog of expert repairs.",
    icon: Search,
  },
  {
    title: "Confirm & Book",
    description:
      "Verify with secure OTP and complete payment via safe UPI gateways.",
    icon: ShieldCheck,
  },
  {
    title: "Live Tracking",
    description:
      "Track your assigned technician in real-time as they arrive at your door.",
    icon: Clock,
  },
  {
    title: "Instant Invoice",
    description:
      "Get a detailed GST invoice immediately upon service completion.",
    icon: CheckCircle,
  },
];

export default function App() {
  const [selectedService, setSelectedService] =
    useState<ServiceCategory | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [introStarted, setIntroStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t, locale, setLocale } = useLocale();

  // Filter States
  const [priceRange, setPriceRange] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedZone, setSelectedZone] = useState<string>("all");

  const filteredServices = SERVICES.filter((service) => {
    // Filter by price range
    if (priceRange !== "all") {
      const price = service.basePrice;
      if (priceRange === "under-250" && price >= 250) return false;
      if (priceRange === "250-500" && (price < 250 || price > 500)) return false;
      if (priceRange === "above-500" && price <= 500) return false;
    }

    // Filter by rating
    if (minRating > 0) {
      const rating = service.technician?.rating || 0;
      if (rating < minRating) return false;
    }

    // Filter by zone
    if (selectedZone !== "all") {
      const zone = (service.technician?.activeZone || "").toLowerCase();
      const searchVal = selectedZone.toLowerCase();
      if (!zone.includes(searchVal)) return false;
    }

    return true;
  });

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            <video
              ref={videoRef}
              src="/hero-video.mp4"
              playsInline
              preload="auto"
              poster="/poster.png.png"
              className="w-full h-full object-contain md:object-cover bg-black transition-opacity duration-300"
              onEnded={() => setShowIntro(false)}
            />
            {!introStarted && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <LightBeamButton
                  onClick={() => {
                    if (videoRef.current) {
                      const playPromise = videoRef.current.play();
                      if (playPromise !== undefined) {
                        playPromise.catch((err) => {
                          console.debug("Intro video play error:", err);
                        });
                      }
                      videoRef.current.muted = false;
                    }
                    setIntroStarted(true);
                  }}
                  gradientColors={["#ff9933", "#1e293b", "#ff9933"]} // Saffron, Navy, Saffron
                  className="bg-navy text-white hover:bg-navy-light shadow-[0_0_40px_rgba(255,153,51,0.4)]"
                >
                  <span className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-saffron border-b-[8px] border-b-transparent translate-x-1" />
                  Start Experience
                </LightBeamButton>
              </div>
            )}
            {introStarted && (
              <button
                onClick={() => setShowIntro(false)}
                className="absolute bottom-8 right-8 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-xl md:bottom-12 md:right-12"
              >
                Skip Intro →
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollProgress />
      <AmbientBackground />
      <div
        className={`min-h-screen font-sans selection:bg-saffron/30 selection:text-navy overflow-x-hidden relative z-0 transition-opacity duration-1000 ${showIntro ? "opacity-0 h-screen overflow-hidden" : "opacity-100"}`}
      >
        {/* Navbar */}
        <nav className="bg-white/80 sticky top-0 z-40 border-b border-slate-100 shadow-sm backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-tr from-saffron to-saffron-dark rounded-2xl flex items-center justify-center text-white shadow-[0_4px_20px_rgba(255,153,51,0.3)] relative overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_8px_25px_rgba(255,153,51,0.4)] group-hover:-rotate-3">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-[150%] skew-x-12 group-hover:animate-[shimmer_1.5s_ease-in-out_infinite]" />
                <div className="relative font-black text-2xl tracking-tighter flex items-center justify-center h-full w-full">
                  S
                  <span className="absolute bottom-2 right-2.5 w-1.5 h-1.5 bg-white rounded-full"></span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-navy leading-none">
                  Servico<span className="text-india-green">.</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5 ml-0.5">
                  India HQ
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors">
                <span className="text-xl leading-none">🌐</span>
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as Locale)}
                  className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer appearance-none pr-2"
                >
                  <option value="en">Eng</option>
                  <option value="hi">हिंदी</option>
                  <option value="mr">मरा</option>
                </select>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white">
                <MapPin className="w-4 h-4 text-saffron" />
                <span className="text-sm font-medium text-slate-600">
                  Nagpur, Maharashtra
                </span>
              </div>
              <button
                onClick={() => setShowProfile(true)}
                className="flex items-center gap-2 px-4 py-2 bg-saffron/10 text-saffron font-bold rounded-full hover:bg-saffron hover:text-white transition-colors"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </div>
                <span className="text-sm">Profile</span>
              </button>
              <a
                href="#services"
                className="text-sm font-semibold text-slate-600 hover:text-navy transition-colors"
              >
                {t("nav.services")}
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-semibold text-slate-600 hover:text-navy transition-colors"
              >
                {t("nav.howItWorks")}
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-12 pb-24 overflow-hidden border-b border-slate-200">
          <div className="absolute inset-0 bg-slate-50 -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Live Ticker */}
            <div className="mb-12">
              <LiveActivityFeed />
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-8 text-center lg:text-left z-10 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 bg-green-50 text-india-green px-4 py-2 rounded-full border border-green-200 font-semibold text-sm shadow-sm"
                >
                  <Star className="w-4 h-4 fill-current" />
                  {t("hero.topBadge")}
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl md:text-6xl xl:text-7xl font-bold text-navy leading-[1.1] tracking-tight"
                >
                  {t("hero.title1")}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron to-saffron-dark">
                    {t("hero.title2")}
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed shadow-sm"
                >
                  {t("hero.subtitle")}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="max-w-md mx-auto lg:mx-0 relative w-full"
                >
                  <div className="bg-white p-2 sm:p-3 rounded-2xl sm:rounded-full shadow-2xl flex flex-col sm:flex-row items-center border border-slate-100 gap-2 sm:gap-0">
                    <div className="flex items-center w-full px-2">
                      <Search className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 min-w-max" />
                      <input
                        type="text"
                        placeholder={t("hero.searchPlaceholder")}
                        className="w-full bg-transparent px-3 sm:px-4 py-2 sm:py-3 outline-none font-medium text-slate-700 text-sm sm:text-base"
                      />
                    </div>
                    <button className="bg-navy hover:bg-navy-light text-white px-6 sm:px-8 py-3 rounded-xl sm:rounded-full font-semibold transition-colors shadow-md w-full sm:w-auto shrink-0 text-sm sm:text-base">
                      {t("hero.findBtn")}
                    </button>
                  </div>
                  <div className="mt-6 text-center lg:text-left">
                    <button
                      onClick={() => {
                        setShowIntro(true);
                        setIntroStarted(false);
                      }}
                      className="inline-flex items-center gap-2 text-navy hover:text-navy-light font-semibold opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <span className="w-8 h-8 rounded-full bg-slate-200/50 flex items-center justify-center">
                        <span className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-navy border-b-[5px] border-b-transparent translate-x-0.5" />
                      </span>
                      Replay Intro Video
                    </button>
                  </div>
                </motion.div>
              </div>

              <div className="flex-1 relative hidden lg:flex justify-center w-full max-w-[500px]">
                {/* 3D Promotional Poster Element */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 8,
                    ease: "easeInOut",
                  }}
                  className="relative z-10 w-full flex items-center justify-center p-4"
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[110%] bg-purple-500/20 rounded-full blur-3xl -z-10" />

                  {/* 
                  NOTE: Target image to be dropped into public/ folder
                */}
                  <img
                    src="/poster.png.png"
                    alt="Servico India Team Poster"
                    className="w-full h-auto max-h-[700px] object-cover rounded-3xl shadow-[0_20px_50px_rgba(109,40,217,0.3)] border-2 border-white/50"
                  />

                  <div className="absolute bottom-10 -left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/40 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default z-20">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0 shadow-inner">
                      <Star className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                      <p className="font-bold text-navy whitespace-nowrap">
                        {t("hero.rating")}
                      </p>
                      <p className="text-sm font-medium text-slate-500 whitespace-nowrap">
                        {t("hero.homes")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 overflow-hidden">
          {/* Services Section */}
          <section id="services" className="relative z-10 pt-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-navy tracking-tight">
                  {t("services.title")}
                </h2>
                <p className="text-slate-500 font-medium mt-2">
                  {t("services.subtitle")}
                </p>
              </div>
            </div>

            {/* Elegant Filter System */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm mb-10 flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-saffron/10 text-saffron flex items-center justify-center">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy text-base">Filter Nagpur Experts</h3>
                    <p className="text-slate-400 text-xs font-medium">Narrow down services by budget, ranking, and locality coverage</p>
                  </div>
                </div>

                {/* Reset Filters Pin (Only shows when filters are active) */}
                {(priceRange !== "all" || minRating !== 0 || selectedZone !== "all") && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => {
                      setPriceRange("all");
                      setMinRating(0);
                      setSelectedZone("all");
                    }}
                    className="flex items-center gap-2 text-xs font-bold text-saffron hover:text-saffron-dark bg-saffron/5 hover:bg-saffron/10 px-4 py-2 rounded-xl transition-all self-start md:self-auto cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset All Filters
                  </motion.button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* 1. Price Range Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Price Range
                  </label>
                  <div className="relative">
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 text-slate-700 font-semibold px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-saffron/30 transition-all text-sm appearance-none cursor-pointer"
                    >
                      <option value="all">All Prices</option>
                      <option value="under-250">Under ₹250 (Budget-friendly)</option>
                      <option value="250-500">₹250 - ₹500 (Mid-range)</option>
                      <option value="above-500">Above ₹500 (Premium deep care)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 2. Rating Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Technician Quality (Rating)
                  </label>
                  <div className="relative">
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-100 text-slate-705 font-semibold px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-saffron/30 transition-all text-sm appearance-none cursor-pointer"
                    >
                      <option value={0}>Any Rating Stars</option>
                      <option value={4.7}>4.7+ ★ Excellent</option>
                      <option value={4.8}>4.8+ ★ Superb</option>
                      <option value={4.9}>4.9+ ★ Master Elite (Top 5%)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 3. Availability Zone */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 inline-block mb-0.5" /> Nagpur Coverage Zone
                  </label>
                  <div className="relative">
                    <select
                      value={selectedZone}
                      onChange={(e) => setSelectedZone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 text-slate-705 font-semibold px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-saffron/30 transition-all text-sm appearance-none cursor-pointer"
                    >
                      <option value="all">All Active Zones</option>
                      <option value="Dharampeth">Dharampeth</option>
                      <option value="Sitabuldi">Sitabuldi</option>
                      <option value="Sadar">Sadar</option>
                      <option value="Wardhaman Nagar">Wardhaman Nagar</option>
                      <option value="Manish Nagar">Manish Nagar</option>
                      <option value="Itwari">Itwari</option>
                      <option value="Pratap Nagar">Pratap Nagar</option>
                      <option value="Ramdaspeth">Ramdaspeth</option>
                      <option value="Civil Lines">Civil Lines</option>
                      <option value="Laxmi Nagar">Laxmi Nagar</option>
                      <option value="Trimurti Nagar">Trimurti Nagar</option>
                      <option value="Besa">Besa</option>
                      <option value="Khamla">Khamla</option>
                      <option value="Wadi">Wadi</option>
                      <option value="Koradi">Koradi</option>
                      <option value="Medical Chowk">Medical Chowk</option>
                      <option value="Bhanegao">Bhanegao</option>
                      <option value="Khaparkheda">Khaparkheda</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {filteredServices.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center py-16 px-6"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">No Matching Services Found</h3>
                <p className="text-slate-500 font-medium max-w-sm mx-auto mb-6">
                  We currently do not have technicians matching your combination of price range, rating, or active Nagpur Coverage Zone.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setPriceRange("all");
                    setMinRating(0);
                    setSelectedZone("all");
                  }}
                  className="bg-navy hover:bg-navy-light text-white font-bold py-2.5 px-6 rounded-xl shadow transition-colors cursor-pointer text-sm"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 group/card-container">
                {filteredServices.map((service, i) => {
                  const IconPattern =
                    service.icon === "Power"
                      ? Power
                      : service.icon === "Droplets"
                        ? Droplets
                        : service.icon === "Wrench"
                          ? Wrench
                          : service.icon === "Bug"
                            ? Bug
                            : Sparkles;
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <TiltCard
                        className="group h-full p-0 relative overflow-hidden"
                        onClick={() => setSelectedService(service)}
                      >
                        <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 group-hover/card-container:animate-[shimmer_1.2s_ease-in-out_forwards] z-30 pointer-events-none" />
                        <div className="flex-grow flex flex-col relative z-20">
                          {service.image ? (
                            <div className="relative w-full h-80 sm:h-96 md:h-[420px] mb-6 -mx-6 -mt-6 rounded-t-2xl overflow-hidden shadow-[inset_0_-10px_20px_rgba(0,0,0,0.4)] bg-navy border-b border-navy">
                              <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent z-10 pointer-events-none" />
                              <img
                                src={service.image}
                                alt={service.name}
                                referrerPolicy="no-referrer"
                                className="relative z-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                              />
                              <motion.div
                                initial={{ scale: 0.3, opacity: 0, rotate: -20 }}
                                whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                  type: "spring",
                                  stiffness: 260,
                                  damping: 15,
                                  delay: i * 0.12 + 0.25
                                }}
                                className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.12)] text-white rounded-xl flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                              >
                                <IconPattern className="w-5 h-5 drop-shadow-md" />
                              </motion.div>
                              {service.iconName === "⚡" && (
                                <div className="absolute bottom-4 left-4 z-20">
                                  <span className="bg-saffron/90 backdrop-blur-md text-navy text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-navy animate-pulse" />{" "}
                                    HOT
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <motion.div
                              initial={{ scale: 0.3, opacity: 0, rotate: -20 }}
                              whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                              viewport={{ once: true }}
                              transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 15,
                                delay: i * 0.12 + 0.25
                              }}
                              className="w-14 h-14 bg-slate-50 group-hover:bg-saffron/10 text-saffron rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:rotate-6"
                            >
                              <IconPattern className="w-7 h-7" />
                            </motion.div>
                          )}

                          <h3 className="text-xl font-bold text-navy mb-2">
                            {service.name}
                          </h3>
                          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                            {service.description}
                          </p>

                          {/* Expandable Technician Card */}
                          <ExpandableTechnician technician={service.technician} />
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-6">
                          <div>
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
                              {t("services.startsFrom")}
                            </span>
                            <span className="font-bold text-lg text-navy">
                              ₹{service.basePrice}
                            </span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-saffron text-slate-400 group-hover:text-white flex items-center justify-center transition-colors">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </TiltCard>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>

          {/* How it Works */}
          <section id="how-it-works" className="mt-24">
            <div className="text-center mb-16 px-4">
              <h2 className="text-3xl font-bold text-navy tracking-tight">
                {t("how.title") || "How It Works"}
              </h2>
              <p className="text-slate-500 font-medium mt-3 max-w-xl mx-auto">
                {t("how.subtitle") ||
                  "A seamless experience from booking to billing."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 text-navy flex items-center justify-center mb-6 group-hover:bg-saffron group-hover:text-white transition-colors duration-300 shadow-sm relative">
                      <Icon className="w-8 h-8 relative z-10" />
                      <div className="absolute -right-2 -top-2 w-6 h-6 bg-navy text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        {i + 1}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-navy mb-3">
                      {t(`how.step${i + 1}.title`) || step.title}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">
                      {t(`how.step${i + 1}.desc`) || step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Trust & Safety Grid */}
          <section className="mt-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-navy tracking-tight">
                {t("trust.title")}
              </h2>
              <p className="text-slate-500 font-medium mt-3 max-w-xl mx-auto">
                {t("trust.subtitle")}
              </p>
            </div>
            <TrustSafetyGrid />
          </section>

          {/* Before / After Reveal */}
          <section className="mt-24">
            <div className="text-center mb-16 px-4">
              <h2 className="text-3xl font-bold text-navy tracking-tight">
                {t("results.title")}
              </h2>
              <p className="text-slate-500 font-medium mt-3 max-w-xl mx-auto">
                {t("results.subtitle")}
              </p>
            </div>
            <BeforeAfterSlider />
          </section>

          {/* Testimonials */}
          <section className="mt-32">
            <TestimonialSlider />
          </section>

          {/* Service Area Map */}
          <section className="mt-32">
            <div className="text-center mb-16 px-4">
              <h2 className="text-3xl font-bold text-navy tracking-tight">
                Our Service Areas
              </h2>
              <p className="text-slate-500 font-medium mt-3 max-w-xl mx-auto">
                We cover major neighborhoods across Nagpur with swift, reliable
                service.
              </p>
            </div>
            <NagpurServiceArea />
          </section>

          {/* Top Rated Technicians */}
          <section className="mt-32">
            <div className="text-center mb-16 px-4">
              <h2 className="text-3xl font-bold text-navy tracking-tight">
                Top Rated Technicians
              </h2>
              <p className="text-slate-500 font-medium mt-3 max-w-xl mx-auto">
                Discover the leading local service professionals who consistently deliver five-star results in your Nagpur neighborhood.
              </p>
            </div>
            <TopTechniciansChart />
          </section>

          {/* Loyalty Programs */}
          <section className="mt-32">
            <LoyaltyRewards />
          </section>
        </main>

        {/* Partners Marquee */}
        <PartnersMarquee />

        {/* Footer */}
        <footer className="bg-navy text-white pt-24 pb-8 border-t-4 border-saffron relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="mb-20">
              <NewsletterSignup />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
              <div className="lg:col-span-1">
                <div className="flex items-center gap-2.5 mb-6 group cursor-pointer w-fit">
                  <div className="w-10 h-10 bg-gradient-to-tr from-saffron to-saffron-dark rounded-xl flex items-center justify-center text-white shadow-[0_4px_15px_rgba(255,153,51,0.2)] relative overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_6px_20px_rgba(255,153,51,0.3)] group-hover:-rotate-3">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-[150%] skew-x-12 group-hover:animate-[shimmer_1.5s_ease-in-out_infinite]" />
                    <div className="relative font-black text-xl tracking-tighter flex items-center justify-center h-full w-full">
                      S
                      <span className="absolute bottom-1.5 right-2 w-1 h-1 bg-white rounded-full"></span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-black tracking-tight text-white leading-none">
                      Servico<span className="text-india-green">.</span>
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5 ml-0.5">
                      India HQ
                    </span>
                  </div>
                </div>
                <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-sm">
                  India's most trusted local service network. Verified
                  technicians, upfront pricing, and seamless UPI payments.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-6 text-white">
                  Quick Links
                </h4>
                <ul className="space-y-3 text-slate-400 text-sm font-medium">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#services"
                      className="hover:text-white transition-colors"
                    >
                      All Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="#how-it-works"
                      className="hover:text-white transition-colors"
                    >
                      How it Works
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Partner with Us
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-6 text-white">
                  Contact Us
                </h4>
                <ul className="space-y-3 text-slate-400 text-sm font-medium">
                  <li>Support: support@servico.in</li>
                  <li>Helpline: 1800-123-4567</li>
                  <li>HQ: Dharampeth, Nagpur</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-6 text-white">
                  Service Areas
                </h4>
                <FooterMap />
                <p className="text-slate-400 text-xs font-medium mt-4 leading-relaxed tracking-wide">
                  Currently serving all major neighborhoods in Nagpur and
                  expanding soon.
                </p>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm font-medium flex flex-col md:flex-row justify-between items-center gap-4">
              <p>© 2026 Servico India. All rights reserved.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>

        <AnimatePresence>
          {selectedService && (
            <BookingWizard
              service={selectedService}
              onClose={() => setSelectedService(null)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showProfile && (
            <UserProfile
              onClose={() => setShowProfile(false)}
              onRebook={(serviceId) => {
                const service = SERVICES.find((s) => s.id === serviceId);
                if (service) setSelectedService(service);
              }}
            />
          )}
        </AnimatePresence>

        <PromoBanner />
        <FloatingAI />
      </div>
    </>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
