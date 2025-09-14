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
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#1F3A93',
          600: '#1a3076',
          700: '#162659',
          800: '#111d3f',
          900: '#0d1426',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          400: '#FFB400',
          500: '#f59e0b',
          600: '#d97706',
        },
        neutral: '#F5F6FA',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}