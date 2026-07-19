# 🛠️ Servico India

> **A premium, 3D interactive Local Service Booking System featuring real-time technician coverage, interactive performance analytics, and seamless instant booking with localized Nagpur coverage.**

---

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=React&logoColor=61DAFB)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)

Servico India reimagines standard home utility services by pairing an immersive **Three.js-powered 3D background** with highly interactive localized features. It acts as a full-stack, rapid-response bridge between certified Nagpur technicians (covering electrical, plumbing, heavy appliance repair, pest control, and custom deep cleaning) and households.

---

## ✨ Key Features

### 🌌 Immersive WebGL Experience
* **Ambient 3D Visualizer**: Implements beautiful reactive canvas backgrounds utilizing **Three.js / React Three Fiber** for modern visual rhythm.
* **Liquid Ether Transitions**: Gorgeous fluid mesh particles that respond dynamically to viewport changes with high-performance responsive scaling.

### 🛡️ High-Performance Local Metrics Dashboard
* **Dynamic Recharts Performance Log**: Interactive bar charts highlighting top-performing technicians, real-time job counts, and 5-star success tallies.
* **Live Spotlight Cards**: Fully responsive highlight cards that update dynamically when hovering over bar chart metrics, displaying verified experience, active zone rosters, and specific certifications.
* **On-Demand Report Export**: Secure, instantaneous generation of a fully compliant **CSV Summary Report** compiled directly on the client side.

### 🗺️ Live Area Mapping & Tracking
* **Detailed Nagpur Coverage**: Complete interactive geographic coordinate trackers spanning **Dharampeth, Sitabuldi, Sadar, Ramdaspeth, Civil Lines, Lakshmi Nagar, Pratap Nagar, Manish Nagar, and more**.
* **Filterable Active Zones**: Dynamic technician allocation filters allowing homeowners to quickly find service professionals in their exact neighborhood.

### 🎥 Robust Media Controls
* **SafeVideo Engine**: Playback controller designed with custom React hooks to completely eliminate media interrupts or browser `AbortError` occurrences whenever tabs or popup modals are unmounted.
* **Interactive Expert Intros**: View real-time short active profiles of specialists demonstrating their credentials.

### ⚡ Seamless End-to-End Booking Wizard
* **Step-by-Step Dispatch Form**: Interactive forms to easily input issues, check address eligibility, and receive transparent pricing estimations.
* **Instant Invoicing & QR Code UPI Payments**: Auto-generates fully compliant, stylized printable receipts with accompanying digital payment vectors.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend UI** | React 19, TypeScript, Tailwind CSS, Motion (Framer Motion) |
| **Data Visualization** | Recharts (Responsive bar charts with custom tooltips) |
| **3D Rendering** | Three.js, React Three Fiber, React Three Drei |
| **Backend & Serving** | Node.js Express server, TSX loader |
| **Build & Bundler** | Vite 6, Esbuild (CommonJS server compilation) |
| **Database** | Firebase / Google Firestore (Real-time tracking and logging) |
| **Document/Receipt Generation** | jsPDF, html-to-image |

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 18+ recommended) installed.

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/servico-india.git
   cd servico-india
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your keys (see `.env.example` for details):
   ```env
   # Add your Google Gemini or Firebase API credentials if applicable
   GEMINI_API_KEY=your_secret_gemini_api_key
   ```

4. **Run Development Server**
   Start the Node.js development server backed by the dual Vite dev middleware engine:
   ```bash
   npm run dev
   ```

5. **Lint and Type Check**
   Verify TypeScript safety parameters across the codebase:
   ```bash
   npm run lint
   ```

6. **Production Build**
   Vite builds client-side assets while Esbuild bundles the backend into standard CommonJS format inside `/dist`:
   ```bash
   npm run build
   ```

7. **Prise-Ready Start**
   Run the optimized, standalone environment server on production:
   ```bash
   npm run start
   ```

---

## 📁 Architecture Overview

```text
├── dist/                          # Compiled Production Assets
├── src/
│   ├── assets/                    # Optimized image and video assets
│   ├── components/                # Modular and reusable UI elements
│   │   ├── SafeVideo.tsx          # Resilient video lifecycle container
│   │   ├── TopTechniciansChart.tsx# Recharts bar graph & active spotlight metadata
│   │   ├── NagpurServiceArea.tsx  # Animated visual map representing local zones
│   │   └── ...                    # Other interactive components
│   ├── lib/                       # Firebase configuration and third-party helpers
│   ├── App.tsx                    # Primary user layout and router gate
│   ├── types.ts                   # Centralized type, enum, and interface declarations
│   └── index.css                  # Tailwinds design declarations and custom themes
├── server.ts                      # Express API routes and Vite dev mode middlewares
├── vite.config.ts                 # Dev environment setup
├── package.json                   # Dependency registries and script configurations
└── README.md                    
```

## 🔒 Security & Performance
* **Lazy SDK Initializations**: All heavy third-party assets and client libraries are initialized dynamically, preventing server startup crashes.
* **Unified Build Strategy**: Eliminates relative ESM import paths by using Esbuild-bundled standard CommonJS targets for near-instantaneous cloud cold starts.

