// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind"; // Import the official Astro Tailwind integration

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind()
  ], 
  // vite: { // Remove direct Vite plugin for Tailwind
  //   plugins: [tailwindcss()] 
  // },
  site: 'https://yaoqih.github.io',
  base: '/bmk_leaderboard/', 
});