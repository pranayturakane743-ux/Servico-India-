import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Award, Star, Briefcase, MapPin, CheckCircle, TrendingUp, Download } from "lucide-react";
import { motion } from "motion/react";

interface TechnicianData {
  name: string;
  specialty: string;
  jobs: number;
  rating: number;
  experience: string;
  color: string;
  activeZone: string;
  certificationsCount: number;
  certificationsList: string[];
}

const TECHNICIAN_DATA: TechnicianData[] = [
  {
    name: "Nirman",
    specialty: "Appliance Repair",
    jobs: 2100,
    rating: 4.9,
    experience: "12 Years",
    color: "#f59e0b",
    activeZone: "Bhanegao, Wardhaman Nagar, Itwari, Ganeshpeth, Nagpur",
    certificationsCount: 2,
    certificationsList: ["LG Certified", "Samsung Certified"],
  },
  {
    name: "Swachh",
    specialty: "Deep Cleaning",
    jobs: 1540,
    rating: 4.9,
    experience: "4 Years",
    color: "#14b8a6",
    activeZone: "Wadi, Manish Nagar, Hingna, Trimurti Nagar, Besa, Khamla, Nagpur",
    certificationsCount: 2,
    certificationsList: ["Bio-Cleaning Standard", "Hygiene Expert Cert"],
  },
  {
    name: "Vidyut",
    specialty: "Electrician",
    jobs: 1250,
    rating: 4.8,
    experience: "8 Years",
    color: "#ff9933",
    activeZone: "Koradi, Dharampeth, Sadar, Ramdaspeth, Civil Lines, Nagpur",
    certificationsCount: 2,
    certificationsList: ["Govt Certified Electrician", "Safety First Cert"],
  },
  {
    name: "Rakshak",
    specialty: "Pest Control",
    jobs: 1020,
    rating: 4.6,
    experience: "6 Years",
    color: "#6366f1",
    activeZone: "Khaparkheda, Sadar, Civil Lines, Koradi, Nagpur",
    certificationsCount: 2,
    certificationsList: ["Chemical Safety", "Exterminator Pro Cert"],
  },
  {
    name: "Neer",
    specialty: "Plumber",
    jobs: 850,
    rating: 4.7,
    experience: "5 Years",
    color: "#06b6d4",
    activeZone: "Medical Chowk, Sitabuldi, Laxmi Nagar, Pratap Nagar, Nagpur",
    certificationsCount: 2,
    certificationsList: ["Advanced Plumbing Systems", "Water Conservation Tech"],
  },
].sort((a, b) => b.jobs - a.jobs);

// Custom styled tooltips
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data: TechnicianData = payload[0].payload;
    return (
      <div className="bg-navy border border-slate-700/50 p-4 rounded-2xl shadow-xl backdrop-blur-md text-white max-w-xs animate-[fadeIn_0.2s_ease-out]">
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-4 h-4 text-saffron" />
          <span className="font-bold text-sm text-white">{data.name}</span>
        </div>
        <p className="text-slate-400 text-xs font-semibold mb-2">{data.specialty}</p>
        
        <div className="space-y-1.5 border-t border-slate-700/50 pt-2 text-[11px] font-medium text-slate-300">
          <div className="flex justify-between gap-4">
            <span>Jobs Done:</span>
            <span className="text-saffron font-bold">{data.jobs.toLocaleString()} jobs</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Rating:</span>
            <span className="text-yellow-400 font-bold flex items-center gap-0.5">
              {data.rating} <Star className="w-3 h-3 fill-yellow-400 inline" />
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Experience:</span>
            <span className="text-white font-bold">{data.experience}</span>
          </div>
          <div className="flex justify-between gap-4 pb-1.5">
            <span>Certifications:</span>
            <span className="text-sky-400 font-bold bg-sky-400/10 px-1.5 py-0.5 rounded text-[10px]">
              {data.certificationsCount} verified
            </span>
          </div>
          
          <div className="pt-1.5 border-t border-slate-700/30">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">Verified Credentials:</p>
            <div className="flex flex-wrap gap-1">
              {data.certificationsList.map((cert) => (
                <span key={cert} className="text-[9px] bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded border border-slate-750">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const TopTechniciansChart = () => {
  const [activeTech, setActiveTech] = useState<TechnicianData>(TECHNICIAN_DATA[0]);

  const handleDownloadCSV = () => {
    const escapeCsvValue = (val: string | number) => {
      const stringVal = String(val);
      if (stringVal.includes(",") || stringVal.includes('"') || stringVal.includes("\n")) {
        return `"${stringVal.replace(/"/g, '""')}"`;
      }
      return stringVal;
    };

    const headers = [
      "Name",
      "Specialty",
      "Completed Jobs",
      "Rating",
      "Experience",
      "Verified Certifications Count",
      "Certifications List",
      "Active Nagpur Zones"
    ];
    
    const csvRows = [
      headers.join(","),
      ...TECHNICIAN_DATA.map(tech => [
        escapeCsvValue(tech.name),
        escapeCsvValue(tech.specialty),
        tech.jobs,
        tech.rating,
        escapeCsvValue(tech.experience),
        tech.certificationsCount,
        escapeCsvValue(tech.certificationsList.join("; ")),
        escapeCsvValue(tech.activeZone)
      ].join(","))
    ];

    const blob = new Blob([csvRows.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `nagpur_top_technicians_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-saffron/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-50/20 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        {/* Left column: Chart and core stats */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 bg-saffron/10 text-saffron text-xs font-extrabold px-3 py-1.5 rounded-full w-fit mb-4 uppercase tracking-widest">
                <TrendingUp className="w-3.5 h-3.5" /> High Performers Log
              </div>
              <h3 className="text-2xl font-extrabold text-navy leading-tight">
                Honoring Nagpur's Top Experts
              </h3>
              <p className="text-slate-400 text-sm font-medium mt-1">
                A real-time relative lookup of our standard service heroes sorted by complete job volumes.
              </p>
            </div>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-bold px-4 py-2.5 rounded-xl transition-all self-start sm:self-auto cursor-pointer text-xs border border-navy/15 shadow-sm inline-flex justify-center flex-shrink-0"
              id="download-metrics-csv-btn"
            >
              <Download className="w-3.5 h-3.5" />
              Download CSV
            </button>
          </div>

          <div className="w-full h-72 md:h-80 -ml-4 pr-2">
            <ResponsiveContainer width="105%" height="100%">
              <BarChart
                data={TECHNICIAN_DATA}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                onMouseMove={(state: any) => {
                  if (state && state.activePayload) {
                    const tech = state.activePayload[0].payload as TechnicianData;
                    setActiveTech(tech);
                  }
                }}
              >
                <defs>
                  {TECHNICIAN_DATA.map((tech) => (
                    <linearGradient
                      key={`gradient-${tech.name}`}
                      id={`colorUv-${tech.name}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={tech.color} stopOpacity={1} />
                      <stop offset="100%" stopColor={tech.color} stopOpacity={0.6} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                  dx={-5}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc", radius: 12 }} />
                <Bar
                  dataKey="jobs"
                  radius={[10, 10, 0, 0]}
                  barSize={40}
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {TECHNICIAN_DATA.map((tech, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#colorUv-${tech.name})`}
                      className="cursor-pointer transition-all duration-300 hover:opacity-90"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right column: Interactive Detail Panel */}
        <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Live Spotlight
              </span>
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-india-green bg-india-green/10 px-2.5 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" /> Fully Verified
              </div>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${activeTech.color}, ${activeTech.color}cc)`,
                }}
              >
                {activeTech.name[0]}
              </div>
              <div>
                <h4 className="text-xl font-black text-navy">{activeTech.name}</h4>
                <p className="text-sm font-semibold text-slate-500 mb-1">
                  {activeTech.specialty} Specialist
                </p>
                <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 px-2 py-0.5 rounded-md w-fit text-xs font-extrabold">
                  <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                  {activeTech.rating} / 5.0 Rating
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-200/60 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white text-navy flex items-center justify-center shadow-sm border border-slate-100">
                  <Briefcase className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                    Industry Experience
                  </p>
                  <p className="text-sm font-bold text-navy mt-1">
                    {activeTech.experience} Active Duty
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white text-navy flex items-center justify-center shadow-sm border border-slate-100">
                  <Award className="w-4 h-4 text-saffron" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                    Proven Reliability
                  </p>
                  <p className="text-sm font-bold text-navy mt-1">
                    {activeTech.jobs.toLocaleString()}+ Completed Orders
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white text-navy flex items-center justify-center shadow-sm border border-slate-100 flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                    Primary Nagpur Zones
                  </p>
                  <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">
                    {activeTech.activeZone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/50 text-[11px] font-medium text-slate-400 text-center">
            Tip: Hover or touch the bars on the left to inspect another top expert!
          </div>
        </div>
      </div>
    </div>
  );
};
