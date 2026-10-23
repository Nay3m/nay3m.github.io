# Jannatul Nayeem — Wildlife Portfolio & Field Notes

[![Site Status](https://img.shields.io/badge/status-ready--to--deploy-brightgreen.svg)](#deployment)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#license)
[![Tech Stack](https://img.shields.io/badge/stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-amber.svg)](#tech-stack)

A field-journal-inspired, zero-dependency personal portfolio site designed for **Jannatul Nayeem**, an undergraduate Zoology student at Jahangirnagar University focusing on wildlife conservation, ecology, biodiversity monitoring, habitat assessment, and GIS for ecological research.

---

## 🌿 Highlights & Visual Features

- **Field-Journal Aesthetic**: Crafted with typography reminiscent of naturalists' notebooks, incorporating topographic contour overlays, field stamp badges, and textured note cards.
- **Interactive SVG Habitat Art**: An original vector illustration in the hero section with a live habitat palette switcher (**Wetland**, **Canopy**, **Edge**) dynamically adjusting notes and visual tones.
- **W3C ARIA Keyboard Navigation**: Accessible tablist interaction allowing keyboard power users to switch habitats using `ArrowLeft`, `ArrowRight`, `Home`, and `End` keys.
- **Organic Water-Droplet Theme Switcher**:
  - Seamless toggle between light paper and dark forest themes.
  - Multi-stage fluid animation featuring realistic droplet gravity fall, surface impact flattening, parabolic splash droplets, central rebound bead, and soaring birds with flapping wing kinematics.
  - Atmospheric color morphing synchronized to the exact moment of water surface impact with GPU-accelerated cubic-bezier transitions.
  - Full `prefers-reduced-motion` compliance for instantaneous, zero-motion toggling.
  - Persistent user preference stored safely in `localStorage`.
- **Zero Build Tools / Native Web**: Built purely with semantic HTML5, modern CSS3 (custom properties, CSS grid, flexbox), and vanilla JavaScript. No node_modules, bundlers, or external dependencies required.
- **Accessibility & SEO First**:
  - Accessible **Skip-to-Content** link for keyboard and screen reader users.
  - Full landmark hierarchy and ARIA attributes (`aria-labelledby`, `aria-expanded`, `aria-selected`, `aria-live="polite"`).
  - OpenGraph & Twitter Cards with custom preview card (`og-preview.svg`) for social media unfurling.
  - Scalable vector favicon (`favicon.svg`).
  - Print stylesheet (`@media print`) for clean physical or PDF printing directly from the browser.

---

## 📁 Repository Structure

```text
jannatul-nayeem-wildlife-portfolio/
├── index.html               # Main semantic markup, SVG assets, and page sections
├── styles.css               # Design system, themes (light/dark), responsive layout & print styles
├── script.js                # Theme animations, habitat switcher, keyboard navigation & clipboard actions
├── cv.html                  # Academic CV template formatted for print and PDF generation
├── Jannatul-Nayeem-CV.pdf   # Formatted, print-ready Curriculum Vitae (PDF)
├── Jannatul-Nayeem-CV.docx  # Original Curriculum Vitae document (DOCX)
├── favicon.svg              # Scalable naturalist droplet & leaf vein favicon
├── og-preview.svg           # 1200x630 OpenGraph social share card
└── README.md                # Project documentation and deployment guide
```

---

## 🗺️ Sections Overview

1. **Hero**: Field notes header, academic standing (First-Year CGPA: 3.92 / 4.00), dual CV download links (PDF & DOCX), and interactive SVG habitat landscape.
2. **01 / Fieldbook (`#fieldbook`)**: Academic grounding in Zoology at Jahangirnagar University, verified academic performance, and recurring ecological inquiry questions.
3. **02 / Research Lens (`#research`)**: Six foundational directions:
   - Conservation & Management
   - Ecology & Behaviour
   - Biodiversity & Monitoring
   - Habitat Assessment
   - GIS for Wildlife Research
   - Human-Wildlife Interactions
4. **03 / Trail So Far (`#journey`)**: Chronological milestone tracker:
   - **2028**: BSc in Zoology (Jahangirnagar University · 1st-Year CGPA: 3.92 / 4.00)
   - **2026**: Butterfly Fair (Annual conservation outreach & live enclosure volunteer)
   - **Dec—Apr**: Insect Rearing and Experimental Station (Research Intern at IRES · Supervised by Dr. Kabirul Bashar)
   - **2021—22**: Rover Scout (Uttara Government College Rover Unit · outdoor navigation & civic service)
   - **2022**: Higher Secondary Certificate (Uttara Government College · Science · GPA 5.00 / 5.00)
5. **04 / Toolkit (`#toolkit`)**: Developing technical capabilities in spatial and quantitative conservation tools (QGIS, R / RStudio, Python, species monitoring, and habitat assessment).
6. **05 / Contact (`#contact`)**: Direct email link, one-click copy email button with feedback status, and verified LinkedIn profile link.

---

## 🚀 Local Development & Preview

Because this portfolio uses pure native web technologies, no build step or package manager is required.

### Option 1: Direct File Opening
Double-click `index.html` or open it directly in any modern web browser (Chrome, Firefox, Safari, Edge).

### Option 2: Local HTTP Server (Recommended)
Running a local web server ensures full support for local font loading and View Transitions:

- **Using Python 3**:
  ```bash
  python -m http.server 8000
  ```
  Then visit `http://localhost:8000` in your browser.

- **Using Node.js (`npx`)**:
  ```bash
  npx serve .
  ```

- **Using VS Code Live Server**:
  Right-click `index.html` and choose **"Open with Live Server"**.

---

## 📄 Re-Generating the PDF CV

If you update `cv.html` and want to recompile the PDF on Windows:

```powershell
& 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' --headless --disable-gpu --print-to-pdf="Jannatul-Nayeem-CV.pdf" "cv.html"
```

---

## 🌐 Deploy to GitHub Pages

1. **Commit & Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete portfolio with PDF CV, favicon, and keyboard a11y"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Navigate to **Settings** → **Pages**.
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Under **Branch**, select `main` (or default branch) and the `/ (root)` folder.
   - Click **Save**.

3. **Live URL**:
   Within 1–2 minutes, GitHub will publish the site at:
   `https://<your-username>.github.io/<repo-name>/`

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE). Feel free to adapt the design system and layout for your own academic or naturalist portfolio.
