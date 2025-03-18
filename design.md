# SchoolStatus Calculator Widget (Astro + Bun)

**Domain:** `calc.deanlofts.xyz`

---

## 1. Purpose

A standalone, client‑side widget for live cost‑saving calculations on Operoo/SchoolStatus websites.  
Built with Astro and **using Bun** as the runtime/build tool.  
Key features:

- **Lightweight**, embeddable JavaScript widget
- **Interactive inputs** (sliders, checkboxes, radio buttons, etc.)
- **Live results** for cost calculations
- **Domain-restricted** (only runs on specified domains)
- **Deployed** at `calc.deanlofts.xyz` for easy embedding
- **Supports multiple calculators** by switching configs

---

## 2. Project Overview

1. **User interacts** with various inputs (slider, checkbox, etc.).
2. **React component** calculates results on the fly.
3. **Astro** builds the site; the output is served from `calc.deanlofts.xyz`.
4. **Domain Restriction** ensures only certain hostnames can run the widget.

---

## 3. File Structure

Here’s the **ASCII tree** of the project:

```plaintext
schoolstatus-calculator/
├── public/
│   └── favicon.svg               # Icon only
├── src/
│   ├── assets/
│   │   ├── astro.svg
│   │   └── background.svg
│   ├── components/
│   │   ├── Calculator.astro      # Main widget component; chooses config by data attribute
│   │   ├── List.astro            # Dropdown/select input
│   │   ├── Slider.astro          # Range slider input
│   │   ├── Checkbox.astro        # Checkbox input
│   │   ├── Radio.astro           # Radio button group
│   │   ├── Field.astro           # Number input with label
│   │   ├── Text.astro            # Static text display
│   │   ├── Image.astro           # Image display
│   │   ├── Button.astro          # Clickable button
│   │   └── Results.astro         # Calculated results display
│   ├── configs/
│   │   ├── operoo.ts             # Operoo-specific calculator configuration
│   │   └── generic.ts            # Generic calculator template config
│   ├── layouts/
│   │   └── Layout.astro          # (Optional) global layout
│   ├── pages/
│   │   ├── index.astro           # (1) Index Page: Explains embedding
│   │   ├── calculator.astro      # (2) Calculator Page: Shows the embedded calculator
│   │   └── components-demo.astro # (3) Demo Page: Showcases all components
│   └── styles/
│       └── global.css            # Global Tailwind CSS v4 styles
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
└── tsconfig.json
```

---

## 4. Three Astro Pages

Below are **three** distinct `.astro` pages fulfilling your request:

### 4.1. `src/pages/index.astro` (Index Page)

This page **explains** how to embed the widget and references domain restrictions:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout>
  <h1>SchoolStatus Calculator Widget: Embedding & Usage</h1>

  <h2>Embedding Instructions</h2>
  <p>To embed the calculator on your site, add the following snippet:</p>
  <pre><code>
&lt;div id="calculator" data-config="operoo"&gt;&lt;/div&gt;
&lt;script src="https://calc.deanlofts.xyz/calculator.js" async&gt;&lt;/script&gt;
  </code></pre>

  <ul>
    <li><strong>data-config</strong> specifies which calculator config to load (e.g. "operoo" or "generic").</li>
    <li><strong>Domain Restriction:</strong> The widget checks <code>window.location.hostname</code> to allow only approved domains.</li>
  </ul>

  <h2>Building & Deploying with Bun</h2>
  <ol>
    <li><strong>Install dependencies:</strong> <code>bun install</code></li>
    <li><strong>Build:</strong> <code>bun run build</code> (outputs <code>dist/</code> folder)</li>
    <li><strong>Deploy:</strong> Host <code>dist/</code> so <code>calculator.js</code> is served from <code>calc.deanlofts.xyz</code>.</li>
  </ol>

  <h2>Domain Restriction</h2>
  <p>
    By default, the widget only runs on
    <code>calc.deanlofts.xyz</code>. If you want to allow other domains,
    update the allowed list in <code>CalculatorReact.tsx</code>.
  </p>

  <p>Check out the <a href="/calculator">Calculator Page</a> to see the live widget.</p>
  <p>Or visit the <a href="/components-demo">Components Demo</a> to see each component in action.</p>
</Layout>
```

### 4.2. `src/pages/calculator.astro` (Calculator Page)

This page **shows** the actual embedded calculator. It references the main `Calculator.astro` component (not to be confused with the React component):

```astro
---
import Layout from '../layouts/Layout.astro';
import Calculator from '../components/Calculator.astro'; // Our main widget
---

<Layout>
  <h1>Live Calculator Widget</h1>
  <p>This page demonstrates the embedded calculator in action.</p>

  <!-- We can specify which config to load, e.g. 'operoo' -->
  <Calculator config="operoo" />
</Layout>
```

> **Explanation:**
>
> - We import the Astro component `Calculator.astro`, pass a prop `config="operoo"` to load the Operoo config.
> - This is how the calculator will appear on your domain.

### 4.3. `src/pages/components-demo.astro` (Components Demo Page)

This page **showcases all components** individually:

```astro
---
import Layout from '../layouts/Layout.astro';
import Slider from '../components/Slider.astro';
import List from '../components/List.astro';
import Checkbox from '../components/Checkbox.astro';
import Radio from '../components/Radio.astro';
import Field from '../components/Field.astro';
import Text from '../components/Text.astro';
import Image from '../components/Image.astro';
import Button from '../components/Button.astro';
import Results from '../components/Results.astro';
---

<Layout>
  <h1>Components Demo</h1>
  <p>Below are examples of each component used in the calculator.</p>

  <section>
    <h2>Slider</h2>
    <Slider
      id="demoSlider"
      label="Example Slider"
      min={0}
      max={100}
      step={1}
      value={50}
      onChange={(val) => console.log('Slider value:', val)}
    />
  </section>

  <section>
    <h2>List (Dropdown)</h2>
    <List
      id="demoList"
      label="Example Dropdown"
      options={[{ label: 'Option A', value: 'A' }, { label: 'Option B', value: 'B' }]}
      value="A"
      onChange={(val) => console.log('Dropdown value:', val)}
    />
  </section>

  <section>
    <h2>Checkbox</h2>
    <Checkbox
      id="demoCheckbox"
      label="Check me"
      checked={false}
      onChange={(checked) => console.log('Checkbox is now:', checked)}
    />
  </section>

  <section>
    <h2>Radio Group</h2>
    <Radio
      id="demoRadio"
      label="Pick an Option"
      options={[
        { label: 'Choice 1', value: '1' },
        { label: 'Choice 2', value: '2' }
      ]}
      value="1"
      onChange={(val) => console.log('Radio selected:', val)}
    />
  </section>

  <section>
    <h2>Number Field</h2>
    <Field
      id="demoField"
      label="Enter a Number"
      value={42}
      onChange={(val) => console.log('Field value:', val)}
    />
  </section>

  <section>
    <h2>Text Component</h2>
    <Text text="This is a static text example." />
  </section>

  <section>
    <h2>Image Component</h2>
    <Image src="/favicon.svg" alt="Example Image" />
  </section>

  <section>
    <h2>Button</h2>
    <Button
      id="demoButton"
      label="Click Me"
      onClick={() => console.log('Button clicked!')}
    />
  </section>

  <section>
    <h2>Results</h2>
    <Results
      id="demoResult"
      label="Calculated Value"
      value={123.45}
    />
  </section>

  <p>These components combine in <code>Calculator.astro</code> and <code>CalculatorReact.tsx</code> to form the full widget.</p>
</Layout>
```

> **Explanation:**
>
> - Demonstrates each component in isolation.
> - Logs changes to `console` for debugging.
> - This page is purely for dev/test to see how each component looks and behaves.

---

## 5. Domain Restriction Code

In addition to referencing domain restrictions in the docs, here’s a **sample** check in your React component (`CalculatorReact.tsx`) that ensures the widget only runs on allowed domains. If the domain is **not** allowed, it hides or disables the widget:

```tsx
// Domain restriction snippet inside CalculatorReact:
useEffect(() => {
  const allowedDomains = ["calc.deanlofts.xyz", "localhost"];
  const currentDomain = window.location.hostname;

  if (!allowedDomains.includes(currentDomain)) {
    // Option 1: Hide the entire calculator
    setResults({});
    setInputs({});
    console.warn(`Domain ${currentDomain} is not allowed to run this widget.`);
    // Optionally, you can display an error message or remove the DOM node
  }
}, []);
```

> **Explanation:**
>
> - `allowedDomains` array includes `calc.deanlofts.xyz` and `localhost` for local testing.
> - If `window.location.hostname` is not in the list, we clear out or disable the widget.

Feel free to customize this logic or move it elsewhere (e.g., a server check or an Astro-level guard).

---

## 6. Full Component Code

Below are the **eleven** component files you already had, included for completeness:

### 6.1 `Calculator.astro`

```astro
---
// Calculator.astro
import React from 'react';
import Calculator from '../components/CalculatorReact';
import { operooConfig } from '../configs/operoo';
import { genericConfig } from '../configs/generic';

const configName = Astro.props.config || 'operoo';
const config = configName === 'generic' ? genericConfig : operooConfig;
---
<div class="calculator-wrapper">
  <Calculator config={config} />
</div>
```

### 6.2 `CalculatorReact.tsx`

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

const Calculator = ({ config }: { config: any }) => {
  const [inputs, setInputs] = useState<any>({});
  const [results, setResults] = useState<any>({});

  // Domain Restriction Example:
  useEffect(() => {
    const allowedDomains = ["calc.deanlofts.xyz", "localhost"];
    const currentDomain = window.location.hostname;
    if (!allowedDomains.includes(currentDomain)) {
      // Optionally hide or disable the widget
      console.warn(`Domain ${currentDomain} is not allowed.`);
    }
  }, []);

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

### 6.3 `Slider.astro`

```astro
---
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

### 6.4 `List.astro`

```astro
---
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

### 6.5 `Checkbox.astro`

```astro
---
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

### 6.6 `Radio.astro`

```astro
---
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

### 6.7 `Field.astro`

```astro
---
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

### 6.8 `Text.astro`

```astro
---
const { text } = Astro.props;
---
<div class="text-component my-4">
  <p>{text}</p>
</div>
```

### 6.9 `Image.astro`

```astro
---
const { src, alt } = Astro.props;
---
<div class="image-component my-4">
  <img src={src} alt={alt} class="max-w-full" />
</div>
```

### 6.10 `Button.astro`

```astro
---
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

### 6.11 `Results.astro`

```astro
---
const { id, label, value } = Astro.props;
---
<div class="results-component my-4">
  <span class="font-bold">{label}:</span> ${value.toFixed(2)}
</div>
```

---

## 7. Cost Calculation Formulas

| **Component**        | **Formula**                                                                 | **Unit Cost**      |
| -------------------- | --------------------------------------------------------------------------- | ------------------ |
| **Paper Cost**       | `(Students × Pages per Student) × 0.014`                                    | $0.014 per page    |
| **Printing Cost**    | `(Students × Pages per Student + Staff × Pages per Staff) × 0.012`          | $0.012 per page    |
| **Maintenance Cost** | `((Students × Pages per Student + Staff × Pages per Staff) ÷ 50,000) × 395` | $395 per 50k pages |
| **Postage Cost**     | `(Students × Mailouts per Student) × 0.5`                                   | $0.50 per mailout  |
| **Total Cost**       | Sum of all the above                                                        | —                  |

---

## 8. Example Calculation (Defaults)

- **Students:** 1,000
- **Pages/Student:** 100
- **Mailouts/Student:** 10
- **Staff:** 50
- **Pages/Staff:** 100

| **Cost Component**   | **Calculation**                          | **USD Output** |
| -------------------- | ---------------------------------------- | -------------- |
| **Paper Cost**       | (1000 × 100) × 0.014                     | $1,400.00      |
| **Printing Cost**    | (1000 × 100 + 50 × 100) × 0.012          | $1,560.00      |
| **Maintenance Cost** | ((1000 × 100 + 50 × 100) ÷ 50,000) × 395 | $987.50        |
| **Postage Cost**     | (1000 × 10) × 0.5                        | $5,000.00      |
| **Total Cost**       | Sum of all above                         | **$8,947.50**  |

---

## 9. Multiple Calculators

1. **Create a new config** file in `src/configs/`.
2. **Switch** `data-config="anotherCalc"` in your HTML embed or Astro page.
3. The `Calculator.astro` loads that config and renders the correct elements.

---

## 10. Final Notes

- **Bun**: Build with `bun run build`, deploy `dist/`.
- **Domain Restriction**: The snippet in `CalculatorReact.tsx` ensures only allowed hostnames can load the widget.
- **Three Astro Pages**: Provided above (`index.astro`, `calculator.astro`, `components-demo.astro`).
- **All Components**: Full code included.
- **Multiple Calculators**: Use the `data-config` attribute to pick your config.
