# 🐉 KaiStream - Premium Anime Streaming Platform

KaiStream is a modern, high-performance anime streaming web application built with **Next.js 16 (App Router)** and **Tailwind CSS v4**. It features a custom-built scraping engine with advanced caching to provide a seamless, ad-free viewing experience with a professional "Emerald" aesthetic.

![KaiStream Hero](https://9anime.org.lv/wp-content/uploads/2024/08/One-Piece-cover-new-1.webp)

## ✨ Features

-   **Cinematic UI:** A polished, modern interface featuring a high-resolution auto-playing hero slider and framer-motion animations.
-   **Advanced Scraper:** Multi-page search support ensuring comprehensive title discovery.
-   **Smart Caching:** Granular in-memory caching system with specialized TTLs (Time-To-Live) for different content types to reduce source site load and improve speed.
-   **Mascot Branding:** Unique "Spirit Core" mascot-themed visual identity with a cohesive Emerald Green color scheme.
-   **Vercel Ready:** Optimized for seamless deployment on Vercel as a unified Next.js application.
-   **Streaming Servers:** Extracts multiple high-quality streaming mirrors for every episode.

## 🚀 Tech Stack

-   **Framework:** Next.js 16 (App Router)
-   **Styling:** Tailwind CSS 4
-   **Icons:** Lucide React
-   **Animations:** Framer Motion
-   **Data Fetching:** Axios & Cheerio (Server-side scraping)

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
```bash
npm install
```

### Step 3: Run the Project
```bash
npm run dev
```
The site will be available at `http://localhost:3000`.

---

## 📡 API Routes

KaiStream includes built-in Next.js API routes that provide the same functionality as the previous standalone API:

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
