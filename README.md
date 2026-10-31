# AIPodcasts — Responsive Sales & Landing Page

A high-converting, fully responsive, standalone sales landing page for **AIPodcasts** built with **vanilla HTML5, CSS3, and JavaScript (ES6)**. Designed with zero runtime libraries, zero npm dependencies, and no build steps—double-click `index.html` to run in any browser.

---

## 📁 Project Structure

```text
AI podcast website/
├── index.html                   # Semantic single-page HTML5 document
├── css/
│   ├── base.css                 # CSS Reset, design tokens (#0A0A0B, #111113, #8B7CF6), Instrument Serif & Inter typography, utilities
│   ├── components.css           # Flat architectural cards, solid & hairline buttons, badges, monoline icons & mockup frames
│   ├── sections.css             # Section-specific layouts, quiet sticky header, shared hairline grids & studio demo player
│   └── responsive.css           # Breakpoints (320px, 390px, 768px, 1024px, 1440px)
├── js/
│   ├── main.js                  # Sticky header, smooth anchor scroll, active nav link observer & safe 12px scroll reveal
│   ├── faq.js                   # Accessible ARIA accordion with keyboard navigation
│   └── video.js                 # Demo video player loader & interactive 44-bar audio waveform
├── assets/
│   ├── stickers/            # Original 3D sticker vector assets (11 SVGs)
│   ├── icons/
│   │   └── favicon.svg          # Modern vector brand favicon
│   ├── images/                  # Royalty-free local WebP photography & vector mockups
│   │   ├── hero-studio-bg.webp
│   │   ├── hero-studio-poster.webp
│   │   ├── problem-studio-gear.webp
│   │   ├── problem-audio-editing.webp
│   │   ├── problem-remote-call.webp
│   │   ├── problem-vocal-fatigue.webp
│   │   ├── solution-creator-studio.webp
│   │   ├── step-bg-typing.webp
│   │   ├── step-bg-headphones.webp
│   │   ├── step-bg-publishing.webp
│   │   ├── feature-dialogue.webp
│   │   ├── feature-mastering.webp
│   │   ├── feature-audiogram.webp
│   │   ├── feature-globe.webp
│   │   ├── feature-syndication.webp
│   │   ├── feature-notes.webp
│   │   ├── usecase-marketers.webp
│   │   ├── usecase-founders.webp
│   │   ├── usecase-creator.webp
│   │   ├── usecase-agency.webp
│   │   ├── demo-audio-bg.webp
│   │   ├── demo-video-poster.webp
│   │   ├── bonus-playbook.webp
│   │   ├── bonus-scripts.webp
│   │   ├── bonus-music.webp
│   │   ├── pricing-bg.webp
│   │   ├── final-cta-bg.webp
│   │   ├── hero-mockup.svg
│   │   ├── step-1-upload.svg
│   │   ├── step-2-voices.svg
│   │   ├── step-3-publish.svg
│   │   └── guarantee-badge.svg
│   └── video/
│       ├── hero-studio-loop.mp4 # Muted, looping 720p H.264 studio video
│       └── hero-studio-loop.webm# VP9 WebM format fallback
└── README.md                    # Project documentation, customization & asset credits
```

---

## 🚀 How to Run

### Method 1: Direct Double-Click (Zero Setup)
Simply open the folder and double-click `index.html` in your file explorer. It opens immediately in Google Chrome, Safari, Firefox, or Microsoft Edge.

### Method 2: VS Code Live Server (Local Dev Server)
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (`ritwickdey.liveserver`) if not already installed.
3. Right-click `index.html` and select **"Open with Live Server"**.
4. The site will launch at `http://127.0.0.1:5500/index.html` with hot-reload on save.

---

## ⚙️ Configuration & Customization Guide

### 1. How to Change the Checkout URL
Open `/js/main.js` and locate line 10 at the top of the file:
```javascript
// Global Config
const CHECKOUT_URL = "https://yourcheckoutprovider.com/checkout";
```
Replace the placeholder `#` with your actual Stripe, LemonSqueezy, Paddle, or custom checkout link. All "Buy Now" buttons in the pricing section will automatically route to this destination.

### 2. How to Replace Content Placeholders
The template follows strict content hygiene. Wherever real pricing or customer assets were pending, clearly styled amber tags (`[Price placeholder]`, `[Testimonial placeholder]`, `[Bonus placeholder]`, `[Guarantee terms placeholder]`) are rendered.

- **To update Pricing:**
  In `index.html` under section `<!-- ==================== PRICING (#pricing) ==================== -->`, locate the `.pricing-card__price-wrapper` div and replace:
  ```html
  <span class="badge badge--placeholder">[Price placeholder]</span>
  ```
  with your price, for example:
  ```html
  <span style="font-size: 2.25rem; font-weight: 700; color: #FFF;">$29</span>
  ```

- **To update Testimonials:**
  In `index.html` under section `<!-- ==================== TESTIMONIALS (#testimonials) ==================== -->`, replace the placeholder badges and generic author details with your authentic customer reviews, client headshots, and company names. Note that initials are preserved by default to avoid implying false endorsement.

- **To update Bonuses & Guarantee Terms:**
  Locate `id="bonuses"` and `id="guarantee"` in `index.html` and replace the placeholder text with your exact promotional offers and guarantee policies.

### 3. How to Swap Images and Video
- **Hero Studio Video:** Replace `/assets/video/hero-studio-loop.mp4` and `hero-studio-loop.webm` with your preferred H.264/VP9 720p muted loop under 3MB.
- **Card Media:** All section photography resides in `/assets/images/` formatted in WebP under 150KB for rapid, layout-shift-free rendering.

---

## 🎨 Visual Design & Texture Upgrades

- **Depth & Atmosphere:** Layered ambient radial gradients (Electric Violet `#7C3AED` and Cyan `#22D3EE` at 18% opacity) providing multi-layered perceptual depth.
- **Micro-Texture:** Subtle film-grain noise overlay using an inline SVG `feTurbulence` data-URI at 3.5% opacity, combined with a faint 28px dot matrix pattern in the hero stage.
- **Glassmorphic Cards:** Frosted backdrop blurs (14px–20px), 1px semi-transparent borders with top hairline highlights (`inset 0 1px 1px rgba(255, 255, 255, 0.12)`), and smooth 4px lift elevations on hover.
- **Interactive Cursor Spotlight:** Mousemove tracking in `main.js` dynamically illuminates each card based on cursor coordinates via `--mx` and `--my` variables (disabled on touch and under `prefers-reduced-motion`).
- **Sheen Action Buttons:** Primary CTAs feature a sweeping light sheen animation on hover with high-contrast `:focus-visible` rings for WCAG 2.1 AA accessibility compliance.
- **Headline Descender Safety:** Line-height calibrated to 1.16–1.22 with `display: inline-block` and vertical padding on gradient text spans to prevent glyph and descender clipping.
- **Performance Safeguards:** Background video is automatically paused when scrolled out of view via `IntersectionObserver`.

---

## 📷 Media Assets & Credits List

All photography and video assets are stored locally (zero hotlinks) and sourced under permissive, commercial-use royalty-free licenses:

| Asset Name | Subject | Source & License |
| :--- | :--- | :--- |
| `hero-studio-bg.webp` | Studio Condenser Microphone & Bokeh | Unsplash (Unsplash License) / Jonathan Velasquez |
| `hero-studio-poster.webp` | Studio Microphone Poster Frame | Unsplash (Unsplash License) / Jonathan Velasquez |
| `hero-studio-loop.mp4` | Studio Background Video (720p, Muted) | MDN Open Media / CC0 Public Domain |
| `hero-studio-loop.webm` | Studio Background Video (WebM) | MDN Open Media / CC0 Public Domain |
| `problem-studio-gear.webp` | Professional Audio Mixing Soundboard | Unsplash (Unsplash License) / Israel Palacio |
| `problem-audio-editing.webp`| Audio Timeline & Waveform Monitor | Unsplash (Unsplash License) / Soundtrap |
| `problem-remote-call.webp` | Remote Video Conference Call on Laptop | Unsplash (Unsplash License) / Chris Montgomery |
| `problem-vocal-fatigue.webp`| Tired Creator Rubbing Temples at Desk | Unsplash (Unsplash License) / Christian Erfurt |
| `solution-creator-studio.webp`| Creator at Desk with Microphone | Unsplash (Unsplash License) / Will Francis |
| `step-bg-typing.webp` | Hands Typing Script on Laptop | Unsplash (Unsplash License) / Glenn Carstens-Peters |
| `step-bg-headphones.webp` | Studio Headphones on Mixing Console | Unsplash (Unsplash License) / C-D-X |
| `step-bg-publishing.webp` | Smartphone with Podcast Player Interface | Unsplash (Unsplash License) / Austin Distel |
| `feature-dialogue.webp` | Dual Podcast Studio Microphones | Unsplash (Unsplash License) / Jonathan Velasquez |
| `feature-mastering.webp` | Audio Mastering Faders & VU Meters | Unsplash (Unsplash License) / Soundtrap |
| `feature-audiogram.webp` | Waveform Equalizer Spectrum | Unsplash (Unsplash License) / Michael Maasen |
| `feature-globe.webp` | Global Connectivity for Multi-Language Dubbing | Unsplash (Unsplash License) / NASA Earth Data |
| `feature-syndication.webp` | Radio Broadcast Antenna Tower | Unsplash (Unsplash License) / Thomas Jensen |
| `feature-notes.webp` | Handwritten Notes & Document Transcription | Unsplash (Unsplash License) / Scott Graham |
| `usecase-marketers.webp` | Digital Marketing Campaign Planning | Unsplash (Unsplash License) / Jason Goodman |
| `usecase-founders.webp` | Startup Founder in Executive Office | Unsplash (Unsplash License) / Hunters Race |
| `usecase-creator.webp` | Solo Content Creator with Headphones | Unsplash (Unsplash License) / Apostolos Vamvouras |
| `usecase-agency.webp` | Creative Agency Production Studio | Unsplash (Unsplash License) / Annie Spratt |
| `demo-audio-bg.webp` | Mixing Console with Ambient Lighting | Unsplash (Unsplash License) / Israel Palacio |
| `demo-video-poster.webp` | Studio Frame with Microphone & Lighting | Unsplash (Unsplash License) / Will Francis |
| `bonus-playbook.webp` | Audience Growth Framework Notes | Unsplash (Unsplash License) / Green Chameleon |
| `bonus-scripts.webp` | Script Template Typography Desk | Unsplash (Unsplash License) / Scott Graham |
| `bonus-music.webp` | Audio Production Keyboard Studio | Unsplash (Unsplash License) / Wes Hicks |
| `pricing-bg.webp` | Dark Ambient Studio Texture | Unsplash (Unsplash License) / Alexander Shatov |
| `final-cta-bg.webp` | Studio Lighting with Violet Bokeh | Unsplash (Unsplash License) / Wes Hicks |

---

## 🌐 Deployment Instructions

### Deploy to Netlify
1. Go to [Netlify](https://www.netlify.com/) and sign in.
2. Drag and drop the entire `AI podcast website` folder into the **Sites** dashboard.
3. Your site will be published instantly with an HTTPS URL.

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`.
2. Inside this folder, run:
   ```bash
   vercel
   ```
3. Set root directory to `.` and deploy.

### Deploy to GitHub Pages
1. Push this folder to a GitHub repository.
2. In GitHub, navigate to **Settings > Pages**.
3. Under **Build and deployment > Branch**, select `main` (or `master`) and `/ (root)`.
4. Click **Save**. Your site will be live at `https://<username>.github.io/<repo>/`.

---

## ✅ Quality & Self-Check Verification Checklist

| Checkpoint | Requirement | Status |
| :--- | :--- | :--- |
| **No Horizontal Scroll** | Tested across 320px, 390px, 768px, 1024px, 1440px | ✅ Verified |
| **Headline Visibility** | No clipped descenders or truncated text; balanced wrapping | ✅ Verified (`display: inline-block; padding-bottom: 0.16em`) |
| **Content Integrity** | Structure, headings, text, and placeholders 100% preserved | ✅ Verified |
| **Scroll-Reveal Safety** | Content 100% visible by default; progressive enhancement only with `.js` class | ✅ Verified |
| **Buttons & Ergonomics** | Min-height 48px, animated sheen on hover, `:focus-visible` rings | ✅ Verified |
| **Accessible Accordion** | ARIA-expanded, ARIA-controls, keyboard navigation, first item open by default | ✅ Verified |
| **Mobile Drawer** | Hamburger menu opens/closes, updates ARIA, closes on link click, closes on Escape, locks body scroll | ✅ Verified |
| **Media Reliability** | All WebP images <150KB, video <1.5MB, local storage with zero external hotlinks | ✅ Verified |
| **Console Errors** | Vanilla ES6, clean scoping, zero console warnings | ✅ Zero errors |
