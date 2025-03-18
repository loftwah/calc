export interface CalculatorElement {
  type: 'slider' | 'list' | 'checkbox' | 'radio' | 'field' | 'text' | 'image' | 'button' | 'result';
  id: string;
  label: string;
  description?: string;
  // Slider specific
  min?: number;
  max?: number;
  step?: number;
  default?: number;
  // List/Radio specific
  options?: Array<{ label: string; value: string }>;
  // Result specific
  formula?: (inputs: Record<string, number>) => number;
  isTotal?: boolean;
}

export interface CalculatorConfig {
  id: string;
  name: string;
  description: string;
  elements: CalculatorElement[];
  allowedDomains: string[];
}

export const templateConfig: CalculatorConfig = {
  id: 'template',
  name: 'Template Calculator',
  description: 'A demo calculator showing all possible components',
  elements: [
    {
      type: 'slider',
      id: 'demoSlider',
      label: 'Demo Slider',
      min: 0,
      max: 100,
      step: 1,
      default: 50,
      description: 'This is a demo slider'
    },
    {
      type: 'text',
      id: 'demoText',
      label: 'Demo Text',
      description: 'This is some static text'
    },
    {
      type: 'result',
      id: 'demoResult',
      label: 'Demo Result',
      formula: (inputs) => inputs.demoSlider * 2
    }
  ],
  allowedDomains: ['localhost', '*.deanlofts.xyz']
};
