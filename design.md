# SchoolStatus Calculator Widget (Astro)

**Domain:** `calc.deanlofts.xyz`

## 🎯 Purpose

A standalone, client‑side widget for live cost‑saving calculations on Operoo/SchoolStatus websites. Built with Astro, it supports interactive inputs, dynamic results, and enforces domain restrictions.

---

## 🔍 Project Overview

- **Lightweight**, embeddable JavaScript widget
- Interactive sliders & live calculations
- Domain‑restricted for security
- Hosted at `calc.deanlofts.xyz` for easy embedding

---

## 📁 Project Structure

```
schoolstatus-calculator/
├── public/
│   └── favicon.svg            # Icon only
├── src/
│   ├── assets/
│   │   ├── astro.svg
│   │   └── background.svg
│   ├── components/
│   │   ├── Calculator.astro     # Main widget component
│   │   ├── Slider.astro         # Slider input component
│   │   └── Result.astro         # Result display component
│   ├── layouts/
│   │   └── Layout.astro         # Layout component
│   ├── pages/
│   │   └── index.astro          # Landing page for development/testing
│   └── styles/
│       └── global.css           # Global Tailwind CSS v4 styles
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
└── tsconfig.json
```

---

## ⚙️ Configuration (`src/configs/operoo.ts`)

```ts
export const operooConfig = {
  elements: [
    {
      type: "slider",
      id: "students",
      label: "Number of Students",
      min: 0,
      max: 3000,
      step: 1,
      default: 1000,
    },
    {
      type: "slider",
      id: "pagesStudent",
      label: "Pages per Student",
      min: 0,
      max: 500,
      step: 1,
      default: 100,
      description:
        "Includes registration, consent forms, handbooks, policies, agreements…",
    },
    {
      type: "slider",
      id: "mailoutsStudent",
      label: "Mailouts per Student",
      min: 0,
      max: 50,
      step: 1,
      default: 10,
      description:
        "Letters via mail. Most schools conduct about 18 mail-outs per year.",
    },
    {
      type: "slider",
      id: "staff",
      label: "Number of Staff",
      min: 0,
      max: 300,
      step: 1,
      default: 50,
    },
    {
      type: "slider",
      id: "pagesStaff",
      label: "Pages per Staff",
      min: 0,
      max: 500,
      step: 1,
      default: 100,
      description: "Includes HR forms, contracts, policies, agreements, etc.",
    },
    {
      type: "result",
      id: "paperCost",
      label: "Paper Cost",
      formula: (inputs) => inputs.students * inputs.pagesStudent * 0.014,
    },
    {
      type: "result",
      id: "printingCost",
      label: "Printing Cost",
      formula: (inputs) =>
        (inputs.students * inputs.pagesStudent +
          inputs.staff * inputs.pagesStaff) *
        0.012,
    },
    {
      type: "result",
      id: "maintenanceCost",
      label: "Maintenance Cost",
      formula: (inputs) =>
        ((inputs.students * inputs.pagesStudent +
          inputs.staff * inputs.pagesStaff) /
          50000) *
        395,
    },
    {
      type: "result",
      id: "postageCost",
      label: "Postage Cost",
      formula: (inputs) => inputs.students * inputs.mailoutsStudent * 0.5,
    },
    {
      type: "result",
      id: "totalCost",
      label: "Total Cost",
      formula: (inputs) =>
        inputs.paperCost +
        inputs.printingCost +
        inputs.maintenanceCost +
        inputs.postageCost,
    },
  ],
  allowedDomains: ["deanlofts.xyz", "*.deanlofts.xyz"],
};
```

---

## 🔐 Domain Restriction (`src/utils/domainCheck.ts`)

```ts
export function checkDomain(
  hostname: string,
  allowedDomains: string[]
): boolean {
  return allowedDomains.some((domain) => {
    if (domain.startsWith("*.")) return hostname.endsWith(domain.slice(2));
    return hostname === domain;
  });
}
```

Use this in your initialisation (e.g. in `src/main.ts` or within a component):

```ts
import { checkDomain } from "../utils/domainCheck";
import { operooConfig as config } from "../configs/operoo";

if (!checkDomain(window.location.hostname, config.allowedDomains)) {
  document.body.innerHTML = "<p>Unauthorized domain</p>";
} else {
  // Mount/render the Calculator component
}
```

---

## 📥 Embedding the Widget

Embed the widget on any page by adding:

```html
<div id="calculator" data-config="operoo"></div>
<script src="https://calc.deanlofts.xyz/calculator.js" async></script>
```

The widget validates the domain before rendering based on the provided configuration.

---

## 🛠 Development Setup

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd schoolstatus-calculator
   npm install
   ```
2. **Run Dev Server**
   ```bash
   npm run dev
   ```
3. **Build for Production**
   ```bash
   npm run build
   ```

---

## 🚀 Deployment (GitHub Pages)

1. **Build:**
   ```bash
   npm run build
   ```
2. **Push the `dist/` folder** to GitHub:
   ```bash
   git add dist
   git commit -m "Deploy to GitHub Pages"
   git push
   ```
3. **GitHub Pages Settings:**
   - Branch: `main`
   - Folder: `/dist`
   - Custom domain: `calc.deanlofts.xyz`
4. **DNS:**  
   Add a CNAME record for `calc.deanlofts.xyz` pointing to your GitHub Pages URL.

---

## 📊 Cost Calculation Formulas

| **Component**        | **Formula**                                                                 | **Unit Cost**      |
| -------------------- | --------------------------------------------------------------------------- | ------------------ |
| **Paper Cost**       | `(Students × Pages per Student) × 0.014`                                    | $0.014 per page    |
| **Printing Cost**    | `(Students × Pages per Student + Staff × Pages per Staff) × 0.012`          | $0.012 per page    |
| **Maintenance Cost** | `((Students × Pages per Student + Staff × Pages per Staff) ÷ 50,000) × 395` | $395 per 50k pages |
| **Postage Cost**     | `(Students × Mailouts per Student) × 0.5`                                   | $0.50 per mailout  |
| **Total Cost**       | Sum of all the above                                                        | —                  |

---

## 📈 Example Calculation (Defaults)

For 1,000 students, 100 pages per student, 10 mailouts per student, 50 staff, and 100 pages per staff:

| **Cost Component**   | **Calculation**                          | **USD Output** |
| -------------------- | ---------------------------------------- | -------------- |
| **Paper Cost**       | (1000 × 100) × 0.014                     | $1,400.00      |
| **Printing Cost**    | (1000 × 100 + 50 × 100) × 0.012          | $1,560.00      |
| **Maintenance Cost** | ((1000 × 100 + 50 × 100) ÷ 50,000) × 395 | $987.50        |
| **Postage Cost**     | (1000 × 10) × 0.5                        | $5,000.00      |
| **Total Cost**       | Sum of all above                         | **$8,947.50**  |
