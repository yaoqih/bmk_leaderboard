// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind"; // Import the official Astro Tailwind integration
// import path from 'node:path'; // No longer needed if using relative path string
import { fileURLToPath } from 'node:url'; // 需要导入
import path from 'node:path';           // 需要导入

// 获取当前文件的目录路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      // 使用简单相对路径
      configFile: './tailwind.config.mjs',
      // 由于您在 BaseLayout.astro 中手动包含了 @tailwind base/components/utilities,
      // 这里应设为 false
      applyBaseStyles: false,
    })
  ], 
  // vite: { // Remove direct Vite plugin for Tailwind
  //   plugins: [tailwindcss()] 
  // },
  base: '/bmk_leaderboard/', 
});