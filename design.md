# SchoolStatus Calculator Widget (Astro + Bun)

**Domain:** `calc.deanlofts.xyz`

---

## 1. Purpose

A standalone, client-side widget for live cost-saving calculations on Operoo/SchoolStatus websites.  
Built with Astro, **using Bun** as the runtime and build tool.  
Supports interactive inputs, dynamic results, and enforces domain restrictions.
  
Key features:

- **Lightweight**, embeddable JavaScript widget
- **Interactive inputs** (sliders, checkboxes, radio buttons, etc.) and **live results**
- **Domain-restricted** for security
- **Deployed** at `calc.deanlofts.xyz` for easy embedding
- **Multiple calculators** (e.g. Operoo Cost Savings, Generic Templates)

---

## 2. Project Structure

Below is the **ASCII tree** showing the project layout:

```plaintext
schoolstatus-calculator/
├── public/
│   └── favicon.svg              # Icon only
├── src/
│   ├── assets/
│   │   ├── astro.svg
│   │   └── background.svg
│   ├── components/
│   │   ├── Calculator.astro     # Main widget component; selects config based on a data attribute
│   │   ├── List.astro           # Dropdown/select input
│   │   ├── Slider.astro         # Range slider input
│   │   ├── Checkbox.astro       # Checkbox input
│   │   ├── Radio.astro          # Radio button group
│   │   ├── Field.astro          # Number input with a label
│   │   ├── Text.astro           # Static text display
│   │   ├── Image.astro          # Image display
│   │   ├── Button.astro         # Clickable button
│   │   └── Results.astro        # Calculated results display
│   ├── configs/
│   │   ├── operoo.ts            # Operoo-specific calculator configuration
│   │   └── generic.ts           # Generic calculator template configuration
│   ├── layouts/
│   │   └── Layout.astro         # (Optional) Global layout for pages
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

## 3. Component Files

Below are **complete code snippets** for key components:

### 3.1. `Calculator.astro`

```astro
---
// Calculator.astro
import React from 'react';
import Calculator from '../components/CalculatorReact'; // React component
import { operooConfig } from '../configs/operoo';
import { genericConfig } from '../configs/generic';

const configName = Astro.props.config || 'operoo';
const config = configName === 'generic' ? genericConfig : operooConfig;
---
<div class="calculator-wrapper">
  <Calculator config={config} />
</div>
```

> **Note:** Reads the `config` prop (from `data-config`), selects the appropriate configuration, and renders a React component.

---

### 3.2. `CalculatorReact.tsx`

```tsx
// src/components/CalculatorReact.tsx
import React, { useState, useEffect } from "react";
import Slider from "./Slider";
import List from "./List";
import Checkbox from "./Checkbox";
import Radio from "./Radio";
import Field from "./Field";
import Text from "./Text";
import Image from "./Image";
import Button from "./Button";
import Results from "./Results";

type CalculatorProps = {
  config: any;
};

const Calculator: React.FC<CalculatorProps> = ({ config }) => {
  const [inputs, setInputs] = useState<any>({});
  const [results, setResults] = useState<any>({});

  useEffect(() => {
    const newResults: any = {};
    config.elements
      .filter((el: any) => el.type === "result")
      .forEach((el: any) => {
        newResults[el.id] = el.formula(inputs);
      });
    setResults(newResults);
  }, [inputs, config]);

  const renderElement = (element: any) => {
    switch (element.type) {
      case "slider":
        return (
          <Slider
            key={element.id}
            {...element}
            value={inputs[element.id] ?? element.default}
            onChange={(value: number) =>
              setInputs({ ...inputs, [element.id]: value })
            }
          />
        );
      case "list":
        return <List key={element.id} {...element} />;
      case "checkbox":
        return (
          <Checkbox
            key={element.id}
            {...element}
            checked={inputs[element.id] ?? false}
            onChange={(checked: boolean) =>
              setInputs({ ...inputs, [element.id]: checked })
            }
          />
        );
      case "radio":
        return <Radio key={element.id} {...element} />;
      case "field":
        return (
          <Field
            key={element.id}
            {...element}
            value={inputs[element.id] ?? element.default}
            onChange={(value: number) =>
              setInputs({ ...inputs, [element.id]: value })
            }
          />
        );
      case "text":
        return <Text key={element.id} {...element} />;
      case "image":
        return <Image key={element.id} {...element} />;
      case "button":
        return <Button key={element.id} {...element} />;
      case "result":
        return (
          <Results key={element.id} {...element} value={results[element.id]} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="calculator">
      {config.elements.map((el: any) => renderElement(el))}
    </div>
  );
};

export default Calculator;
```

> **Note:** Iterates over each element in the config, renders the appropriate component, and updates state accordingly.

---

### 3.3. `Slider.astro`

```astro
---
// Slider.astro
const { id, label, min, max, step, description, value, onChange } = Astro.props;
---
<div class="slider-component my-4">
  <label for={id} class="block font-bold">{label}</label>
  <input
    id={id}
    type="range"
    min={min}
    max={max}
    step={step}
    value={value}
    onInput={(e) => onChange(Number(e.target.value))}
    class="w-full"
  />
  <p class="mt-1">{value}</p>
  {description && <p class="text-sm text-gray-600">{description}</p>}
</div>
```

---

### 3.4. `List.astro`

```astro
---
// List.astro
const { id, label, options, value, onChange } = Astro.props;
---
<div class="list-component my-4">
  <label for={id} class="block font-bold">{label}</label>
  <select id={id} value={value} onChange={(e) => onChange(e.target.value)} class="w-full">
    {options.map((option) => (
      <option value={option.value}>{option.label}</option>
    ))}
  </select>
</div>
```

---

### 3.5. `Checkbox.astro`

```astro
---
// Checkbox.astro
const { id, label, checked, onChange } = Astro.props;
---
<div class="checkbox-component my-4">
  <label for={id} class="inline-flex items-center">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      class="mr-2"
    />
    {label}
  </label>
</div>
```

---

### 3.6. `Radio.astro`

```astro
---
// Radio.astro
const { id, label, options, value, onChange } = Astro.props;
---
<div class="radio-component my-4">
  <p class="font-bold">{label}</p>
  {options.map((option) => (
    <label class="inline-flex items-center mr-4">
      <input
        type="radio"
        name={id}
        value={option.value}
        checked={value === option.value}
        onChange={() => onChange(option.value)}
        class="mr-1"
      />
      {option.label}
    </label>
  ))}
</div>
```

---

### 3.7. `Field.astro`

```astro
---
// Field.astro
const { id, label, value, onChange } = Astro.props;
---
<div class="field-component my-4">
  <label for={id} class="block font-bold">{label}</label>
  <input
    id={id}
    type="number"
    value={value}
    onInput={(e) => onChange(Number(e.target.value))}
    class="w-full border p-2"
  />
</div>
```

---

### 3.8. `Text.astro`

```astro
---
// Text.astro
const { text } = Astro.props;
---
<div class="text-component my-4">
  <p>{text}</p>
</div>
```

---

### 3.9. `Image.astro`

```astro
---
// Image.astro
const { src, alt } = Astro.props;
---
<div class="image-component my-4">
  <img src={src} alt={alt} class="max-w-full" />
</div>
```

---

### 3.10. `Button.astro`

```astro
---
// Button.astro
const { id, label, onClick } = Astro.props;
---
<button
  id={id}
  onClick={onClick}
  class="button-component bg-blue-500 text-white py-2 px-4 rounded"
>
  {label}
</button>
```

---

### 3.11. `Results.astro`

```astro
---
// Results.astro
const { id, label, value } = Astro.props;
---
<div class="results-component my-4">
  <span class="font-bold">{label}:</span> ${value.toFixed(2)}
</div>
```

---

## 4. Building & Deploying with Bun

1. **Install Dependencies**

   ```bash
   bun install
   ```

   (Assuming `package.json` is configured for Bun.)

2. **Build Your Astro Project**

   ```bash
   bun run build
   ```

   This produces a `dist/` folder with the final static output (including `calculator.js`).

3. **Deploy the `dist/` Folder**  
   Host it on GitHub Pages or any hosting provider so the JS file is publicly available at:  
   `https://calc.deanlofts.xyz/calculator.js`

---

## 5. Embedding the Widget

On **any** site or page where you want the calculator, add:

```html
<div id="calculator" data-config="operoo"></div>
<script src="https://calc.deanlofts.xyz/calculator.js" async></script>
```

- **`data-config="operoo"`** loads the Operoo config by default.
- **`async`** ensures non-blocking loading.

---

## 6. Cost Calculation Formulas

| **Component**        | **Formula**                                                                 | **Unit Cost**      |
| -------------------- | --------------------------------------------------------------------------- | ------------------ |
| **Paper Cost**       | `(Students × Pages per Student) × 0.014`                                    | $0.014 per page    |
| **Printing Cost**    | `(Students × Pages per Student + Staff × Pages per Staff) × 0.012`          | $0.012 per page    |
| **Maintenance Cost** | `((Students × Pages per Student + Staff × Pages per Staff) ÷ 50,000) × 395` | $395 per 50k pages |
| **Postage Cost**     | `(Students × Mailouts per Student) × 0.5`                                   | $0.50 per mailout  |
| **Total Cost**       | Sum of all the above                                                        | —                  |

---

## 7. Example Calculation (Defaults)

**Defaults:**

- 1,000 students
- 100 pages per student
- 10 mailouts per student
- 50 staff
- 100 pages per staff

| **Cost Component**   | **Calculation**                          | **USD Output** |
| -------------------- | ---------------------------------------- | -------------- |
| **Paper Cost**       | (1000 × 100) × 0.014                     | $1,400.00      |
| **Printing Cost**    | (1000 × 100 + 50 × 100) × 0.012          | $1,560.00      |
| **Maintenance Cost** | ((1000 × 100 + 50 × 100) ÷ 50,000) × 395 | $987.50        |
| **Postage Cost**     | (1000 × 10) × 0.5                        | $5,000.00      |
| **Total Cost**       | Sum of all above                         | **$8,947.50**  |

---

## 8. Multiple Calculators

You can support multiple calculators in the same widget:

1. **Create a new config** (e.g. `src/configs/anotherCalc.ts`)
2. **Update** `Calculator.astro` to detect the new config name:
   ```astro
   const configName = Astro.props.config || 'operoo';
   // ...
   ```
3. **Embed** using `data-config="anotherCalc"` if you want to load the new config:
   ```html
   <div id="calculator" data-config="anotherCalc"></div>
   <script src="https://calc.deanlofts.xyz/calculator.js" async></script>
   ```

---

## 9. Documentation Pages

Below are the **three** suggested pages (or sections) you might include:

### 9.1. Index Page – How to Use & Embed

Explains how to embed the calculator into your site.  
Shows the `<div id="calculator" data-config="..."></div>` snippet and the `<script>` reference.  
Covers domain restrictions, build process, and general usage notes.

### 9.2. Calculator Page – Live Widget

Displays the **live** embedded calculator.  
Useful for testing and verifying real-time calculations.  
Lets you confirm that everything (sliders, checkboxes, etc.) works correctly.

### 9.3. Components Demo Page – All Components

Demonstrates each component (slider, list, checkbox, radio, field, text, image, button, results) in isolation.  
Ideal for developers wanting to see how each part behaves.  
Serves as a reference if you add or modify components later.

---

## Final Notes

- **Bun Runtime:** All build commands assume Bun (`bun install`, `bun run build`).
- **Embeddable JS:** After building, the `dist/` folder contains `calculator.js`. Host it and embed it via the snippet.
- **Multiple Calculators:** Add as many config files as needed and switch via the `data-config` attribute.
- **All Components Included:** The entire code is shown above for easy reference or debugging.
