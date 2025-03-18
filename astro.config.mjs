// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://calc.deanlofts.xyz',
  base: '/',
  vite: {
    plugins: [tailwindcss()]
  }
});