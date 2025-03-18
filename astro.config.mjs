// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://loftwah.github.io',
  base: '/calc',
  vite: {
    plugins: [tailwindcss()]
  }
});