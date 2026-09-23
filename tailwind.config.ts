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
        rose: {
          50: '#FDF2F4',
          100: '#FCE7EB',
          200: '#F8CFD8',
          300: '#F3A7B9',
          400: '#EB7595',
          500: '#DE4A73',
          600: '#C72F57',
          700: '#A72144',
          800: '#8B1E3B',
          900: '#751D35',
        },
        sage: {
          50: '#F4F7F5',
          100: '#E6ECE7',
          200: '#D0DDD2',
          300: '#ADC4B1',
          400: '#85A68B',
          500: '#688B6F',
          600: '#516F57',
          700: '#415846',
        },
        lavender: {
          50: '#F7F6FA',
          100: '#EFEBF4',
          200: '#DFD8EA',
          300: '#C5B9DA',
          400: '#A894C6',
          500: '#8E73B2',
          600: '#775B9C',
        },
        cream: {
          50: '#FDFAF6',
          100: '#FAF5ED',
          200: '#F4E9D8',
          300: '#EBD8BD',
        },
        charcoal: {
          50: '#F6F5F6',
          100: '#E7E5E7',
          200: '#CFCCCF',
          300: '#AAA4AA',
          400: '#837B83',
          500: '#645B64',
          600: '#4F4750',
          700: '#3F3840',
          800: '#2E272E',
          900: '#1E191E',
          950: '#130F13',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        bangla: ['var(--font-bangla)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(222, 74, 115, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 10px 30px -4px rgba(222, 74, 115, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 25px -5px rgba(222, 74, 115, 0.3)',
      }
    },
  },
  plugins: [],
};

export default config;
