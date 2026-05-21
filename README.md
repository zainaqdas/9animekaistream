# 🐉 KaiStream - Premium Anime Streaming Platform

KaiStream is a modern, high-performance anime streaming web application built with **Next.js 16**, **Tailwind CSS v4**, and **Express.js**. It features a custom-built scraping engine with advanced caching to provide a seamless, ad-free viewing experience with a professional "Emerald" aesthetic.

![KaiStream Hero](https://9anime.org.lv/wp-content/uploads/2024/08/One-Piece-cover-new-1.webp)

## ✨ Features

-   **Cinematic UI:** A polished, modern interface featuring a high-resolution auto-playing hero slider and framer-motion animations.
-   **Advanced Scraper:** Multi-page search support ensuring comprehensive title discovery.
-   **Smart Caching:** Granular in-memory caching system with specialized TTLs (Time-To-Live) for different content types to reduce source site load and improve speed.
-   **Mascot Branding:** Unique "Spirit Core" mascot-themed visual identity with a cohesive Emerald Green color scheme.
-   **Responsive Design:** Fully optimized for mobile, tablet, and desktop viewing.
-   **Streaming Servers:** Extracts multiple high-quality streaming mirrors for every episode.

## 🚀 Architecture

The project is split into two primary components:

### 1. Frontend (Client)
-   **Framework:** Next.js 16 (App Router)
-   **Styling:** Tailwind CSS 4 (Beta)
-   **Icons:** Lucide React
-   **Animations:** Framer Motion
-   **Data Fetching:** Server-side scraping with client-side hydration.

### 2. Backend (API)
-   **Framework:** Express.js
-   **Parsing:** Cheerio (High-speed HTML parsing)
-   **HTTP Client:** Axios (Configured with custom User-Agents and timeouts)

---

## 🛠️ Installation & Setup

### Prerequisites
-   Node.js (v18 or higher)
-   npm or yarn

### Step 1: Clone the Repository
```bash
git clone https://github.com/zainaqdas/9animekaistream.git
cd 9animekaistream
```

### Step 2: Install Dependencies
Install root dependencies and client dependencies:
```bash
# Root (API)
npm install

# Client (Frontend)
cd client
npm install
```

### Step 3: Run the Project
You can run both components independently:

**Start the Frontend:**
```bash
cd client
npm run dev
```
The site will be available at `http://localhost:3000`.

**Start the Backend API (Optional):**
```bash
node src/api/index.js
```
The API will be available at `http://localhost:3000` (Note: default Next.js port is 3000, ensure you configure the API port in `index.js` if running simultaneously).

---

## 📡 API Endpoints (Standalone API)

The standalone Express server provides the following endpoints:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/search?q={query}` | GET | Searches for anime titles across multiple pages. |
| `/api/anime/{slug}` | GET | Fetches detailed info, synopsis, and episode list. |
| `/api/episode/{slug}` | GET | Extracts all available streaming mirror links. |

---

## 🛡️ Caching Strategy

KaiStream uses a sophisticated caching layer to ensure speed and stability:
-   **Search Results:** 24 Hours (Stable titles)
-   **Anime Info:** 15 Minutes (Fast updates for new episodes)
-   **Stream Links:** 2 Hours (Stable links)
-   **Latest Updates:** 5 Minutes (Real-time release tracking)
-   **Trending/Top Airing:** 12-24 Hours (Long-term rankings)

---

## 🎨 Brand Identity

KaiStream uses a bespoke **Emerald Green** theme (`#10b981`).
-   **Mascot:** The Spirit Core — representing the energy and flow of the community.
-   **Typography:** Bold, italicized uppercase headers for a high-energy streaming feel.
-   **Background:** A custom mesh-style dark background with fixed emerald radial glows for depth and contrast.

---

## ⚖️ Disclaimer
KaiStream is a project created for educational purposes. It does not store any files on its server; all contents are provided by non-affiliated third parties.

Built with ❤️ for the anime community.
