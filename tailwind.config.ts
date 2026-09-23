import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          50: '#F9F6F9',
          100: '#F3ECF3',
          200: '#E6D8E6',
          300: '#D2BCD3',
          400: '#B596B7',
          500: '#875E8C',
          600: '#6E4874',
          700: '#5B405F', // Primary Plum
          800: '#3F2A43', // Deep Plum
          900: '#2C1D2F',
          950: '#1C121E',
        },
        dustyRose: {
          50: '#FAF5F7',
          100: '#F3E5E9', // Soft Blush
          200: '#EBD0D9',
          300: '#DEADC0',
          400: '#C58A9A', // Dusty Rose
          500: '#AB6E7F',
          600: '#8F5364',
          700: '#754050',
          800: '#5E313F',
          900: '#4D2733',
        },
        champagne: {
          50: '#FAF8F2',
          100: '#F6F0E0',
          200: '#ECDEC0',
          300: '#E0C898',
          400: '#D8B878', // Warm Champagne / Soft Gold
          500: '#C7A25A',
          600: '#A98441',
          700: '#86642E',
          800: '#6E5127',
          900: '#5A4122',
        },
        ivory: {
          50: '#FDFCFA',
          100: '#FCF9F6', // Light Warm Ivory
          200: '#F8F3ED',
          300: '#EFE7DC',
          400: '#E2D5C4',
          500: '#D0BFAB',
        },
        sage: {
          50: '#F6F8F5',
          100: '#ECF1EB',
          200: '#DAE4D8',
          300: '#C1D3BE',
          400: '#A8B9A5', // Soft Sage
          500: '#8B9F87',
          600: '#6E856A',
          700: '#576B53',
          800: '#455542',
          900: '#394636',
        },
        charcoal: {
          50: '#F7F6F7',
          100: '#ECEBED',
          200: '#DCD9DD',
          300: '#BDB7C0',
          400: '#948D98',
          500: '#746D78',
          600: '#574F5B',
          700: '#433B45',
          800: '#29242A', // Deep Charcoal with plum undertone
          900: '#1E1920',
          950: '#141016',
        },
        // Alias rose to dustyRose for backwards compatibility where needed
        rose: {
          50: '#FAF5F7',
          100: '#F3E5E9',
          200: '#EBD0D9',
          300: '#DEADC0',
          400: '#C58A9A',
          500: '#5B405F',
          600: '#3F2A43',
          700: '#2C1D2F',
          800: '#221525',
          900: '#190E1B',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        bangla: ['"Kalpurush"', '"SolaimanLipi"', '"Noto Sans Bengali"', '"Bangla"', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        'subtle': '0 2px 10px -1px rgba(63, 42, 67, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        'premium': '0 10px 25px -4px rgba(63, 42, 67, 0.06), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
        'glow-gold': '0 0 24px -4px rgba(216, 184, 120, 0.35)',
        'hero': '0 14px 34px -6px rgba(63, 42, 67, 0.18)',
      }
    },
  },
  plugins: [],
};

export default config;
