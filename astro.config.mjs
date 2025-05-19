// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind"; // Import the official Astro Tailwind integration
// import path from 'node:path'; // No longer needed if using relative path string

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      // Apply custom config path
      configFile: './tailwind.config.mjs' // Correct option to specify config file path
    })
  ], 
  // vite: { // Remove direct Vite plugin for Tailwind
  //   plugins: [tailwindcss()] 
  // },
  base: '/bmk_leaderboard/', 
});