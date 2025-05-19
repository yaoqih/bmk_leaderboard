/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class', // Standard class-based dark mode for Tailwind v3
  theme: {
    extend: {},
  },
  plugins: [
    // Example: require('@tailwindcss/typography'),
    // Example: require('@tailwindcss/forms'),
    // headlessuiPlugin might need to be re-added if compatible with v3, or find an alternative
  ],
}; 