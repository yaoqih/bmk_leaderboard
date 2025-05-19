// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind"; // Import the official Astro Tailwind integration
// import path from 'node:path'; // No longer needed if using relative path string

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      configFile: 'tailwind.config.mjs', // Explicitly point to the config
    })
  ], 
  // vite: { // Remove direct Vite plugin for Tailwind
  //   plugins: [tailwindcss()] 
  // },
  base: '/bmk_leaderboard/', 
});