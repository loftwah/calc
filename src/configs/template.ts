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
      type: 'list',
      id: 'demoList',
      label: 'Demo List',
      options: [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' }
      ],
      description: 'This is a demo dropdown list'
    },
    {
      type: 'checkbox',
      id: 'demoCheckbox',
      label: 'Demo Checkbox',
      description: 'This is a demo checkbox'
    },
    {
      type: 'radio',
      id: 'demoRadio',
      label: 'Demo Radio',
      options: [
        { label: 'Choice 1', value: '1' },
        { label: 'Choice 2', value: '2' }
      ],
      description: 'This is a demo radio group'
    },
    {
      type: 'field',
      id: 'demoField',
      label: 'Demo Field',
      description: 'This is a demo number input field'
    },
    {
      type: 'text',
      id: 'demoText',
      label: 'Demo Text',
      description: 'This is some static text content'
    },
    {
      type: 'result',
      id: 'demoResult',
      label: 'Demo Result',
      formula: (inputs) => inputs.demoSlider * 2,
      description: 'This shows a calculated result'
    },
    {
      type: 'result',
      id: 'demoTotal',
      label: 'Demo Total',
      formula: (inputs) => inputs.demoSlider * 2,
      isTotal: true,
      description: 'This shows a total calculation'
    }
  ],
  allowedDomains: ['localhost', '*.deanlofts.xyz']
};
