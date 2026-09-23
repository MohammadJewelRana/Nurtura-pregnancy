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
        // Sophisticated Dark Navy & Slate Surfaces
        navy: {
          bg: '#07111F',          // Main Background
          secondary: '#0B1626',   // Secondary Background / Sidebar
          surface: '#0F1C2D',     // Primary Card Surface
          elevated: '#132235',    // Elevated Cards / Modals / Hover
          border: '#1D3345',      // 1px Subtle Border
          subtle: '#263D52',      // Active border / Divider
        },
        // Primary Emerald & Teal Palette
        emerald: {
          DEFAULT: '#00C99A',
          primary: '#00C99A',     // Primary Emerald
          teal: '#00BFA5',        // Primary Teal
          accent: '#22D3B6',      // Bright Accent Cyan/Teal
          soft: '#7DE7D2',        // Soft Teal
          dark: '#009E78',
          glow: 'rgba(0, 201, 154, 0.15)',
        },
        // High-contrast Typography
        text: {
          primary: '#F5F8FA',     // 95% Pure White with cool blue tint
          secondary: '#A7B5C5',   // Crisp Slate
          muted: '#718197',       // Muted Labels & Timestamps
        },
        // Semantic States
        state: {
          success: '#65C18C',
          warning: '#E7B95E',
          danger: '#E87878',
        },
        // Maintain backwards compatibility aliases with dark navy mapping
        charcoal: {
          50: '#F5F8FA',
          100: '#E4ECF4',
          200: '#C7D6E6',
          300: '#A7B5C5',
          400: '#718197',
          500: '#54667C',
          600: '#3A4C62',
          700: '#1D3345',
          800: '#132235',
          900: '#0F1C2D',
          950: '#07111F',
        },
        plum: {
          50: '#F5FBF9',
          100: '#E2F7F2',
          200: '#C0F0E4',
          300: '#7DE7D2',
          400: '#22D3B6',
          500: '#00C99A',
          600: '#00BFA5',
          700: '#009E78',
          800: '#132235',
          900: '#0F1C2D',
          950: '#07111F',
        },
        dustyRose: {
          50: '#F5FBF9',
          100: '#E2F7F2',
          200: '#7DE7D2',
          300: '#22D3B6',
          400: '#00C99A',
          500: '#00BFA5',
          600: '#009E78',
          700: '#007F60',
          800: '#132235',
          900: '#0F1C2D',
        },
        champagne: {
          50: '#FAF8F2',
          100: '#F6F0E0',
          200: '#ECDEC0',
          300: '#E7B95E',
          400: '#E7B95E',
          500: '#D5A447',
          600: '#B88732',
          700: '#86642E',
          800: '#132235',
          900: '#0F1C2D',
        },
        ivory: {
          50: '#0F1C2D',
          100: '#0B1626',
          200: '#132235',
          300: '#1D3345',
          400: '#718197',
          500: '#A7B5C5',
        },
        sage: {
          50: '#0F1C2D',
          100: '#132235',
          200: '#1D3345',
          300: '#7DE7D2',
          400: '#00C99A',
          500: '#00BFA5',
          600: '#65C18C',
          700: '#4DA272',
          800: '#132235',
          900: '#07111F',
        },
        rose: {
          50: '#0F1C2D',
          100: '#132235',
          200: '#1D3345',
          300: '#22D3B6',
          400: '#00C99A',
          500: '#00BFA5',
          600: '#009E78',
          700: '#007F60',
          800: '#132235',
          900: '#07111F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        bangla: ['"Kalpurush"', '"SolaimanLipi"', '"Noto Sans Bengali"', 'sans-serif'],
      },
      borderRadius: {
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
        'premium': '0 8px 24px -4px rgba(0, 0, 0, 0.5), 0 2px 6px -2px rgba(0, 0, 0, 0.3)',
        'glow-emerald': '0 0 28px -4px rgba(0, 201, 154, 0.25)',
        'glow-teal': '0 0 28px -4px rgba(0, 191, 165, 0.3)',
        'elevated': '0 12px 32px -4px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
};

export default config;
