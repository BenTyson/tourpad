/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'test-red': '#ff0000',
        // Override specific gray shades that are too light
        'gray-600': '#374151',
        'gray-700': '#1f2937', 
        'gray-800': '#111827',
        'gray-900': '#0f172a',
      }
    },
  },
  plugins: [],
}