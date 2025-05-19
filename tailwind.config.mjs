/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class', // Standard class-based dark mode for Tailwind v3
  safelist: [
    // Globals and Header related
    'bg-white',
    'dark:bg-slate-900',
    'text-gray-800',
    'dark:text-slate-200',
    'border-gray-200',
    'dark:border-slate-700',
    'bg-gray-100',
    'text-gray-700',
    'dark:text-slate-300',
    'hover:text-sky-600',
    'dark:hover:text-sky-400',
    'bg-sky-500',
    'text-white',
    'dark:bg-sky-500', // Active language button dark
    'dark:text-white', // Active language button dark text

    // Story Detail Page - common static and dynamic classes
    'p-4', 'p-6',
    'mb-2', 'mb-4', 'mb-6',
    'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl',
    'font-semibold',
    'rounded-lg', 'rounded-xl', 'rounded-2xl',
    'bg-gray-50',
    'dark:bg-slate-800',
    'dark:bg-opacity-50', // For focused model container
    'border',
    'border-transparent',
    'shadow-lg',
    'hover:bg-gray-100',
    'dark:hover:bg-slate-700',
    'grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-4', 'gap-x-4',
    'flex', 'items-center', 'justify-between', 'flex-col', 'flex-wrap',

    // Classes specifically for JavaScript-driven elements in story_detail.astro
    // Model visibility selector
    'bg-gray-200', 
    'dark:bg-gray-700', 
    'hover:bg-gray-300', 
    'dark:hover:bg-gray-600',
    'px-3', 'py-1', 'px-4', 'py-2', 

    // Model containers & focus (updateFocusInContainer)
    'border-2',
    'border-blue-500', 
    'dark:border-sky-400',
    'ring-2',
    'ring-offset-2',
    'ring-blue-500',
    'dark:ring-sky-400',
    'dark:ring-offset-slate-900', // Assuming body dark bg for offset
    'opacity-50', // for non-focused items if used
    'opacity-100',

    // Character reference images
    'w-20', 'h-20', 'w-24', 'h-24', 'object-cover',

    // Generic patterns that might be useful (use sparingly)
    {
      pattern: /text-(xs|sm|base|lg|xl|2xl|3xl|4xl)/, 
    },
    {
      pattern: /p[xy]?-\d+/,
    },
    {
      pattern: /m[xy]?-\d+/,
    },
    {
      pattern: /gap-[xy]?-\d+/,
    },
    {
        pattern: /rounded-(sm|md|lg|xl|2xl|3xl|full)/,
    },
    {
        pattern: /border-(gray|slate|blue|sky|transparent)-(100|200|300|400|500|600|700|800|900)/, 
    },
    {
        pattern: /bg-(gray|slate|blue|sky)-(50|100|200|300|400|500|600|700|800|900)/, 
    },
    {
        pattern: /text-(gray|slate|blue|sky|white|black)-(50|100|200|300|400|500|600|700|800|900)/, 
    }
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // Example: require('@tailwindcss/typography'),
    // Example: require('@tailwindcss/forms'),
    // headlessuiPlugin might need to be re-added if compatible with v3, or find an alternative
  ],
}; 