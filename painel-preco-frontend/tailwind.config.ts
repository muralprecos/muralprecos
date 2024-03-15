// tailwind.config.js
const {nextui} = require("@nextui-org/react");

const COLORS = {
  purple: '#6d0bd8',
  green: '#a1f71c',
  greenMedium: '#7ee62f',
  purpleDark: '#1b0945'
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        'spin-slow': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 2s linear infinite',
      }
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      //https://colors.muz.li/palette/6d0bd8/350a97/d6c3ff/ac88ff/ffffff
      //https://coolors.co/palettes/popular/violet
      prefix: 'tt',
      themes: {
        light: {
          layout: {}, // light theme layout tokens
          colors: {
            'bg-gradiente-inicial': '#daccf8',
            'bg-gradiente-final': '#eee8fa',
            background: '#fff',
            foreground: '#222',
            primary: {
              50: '#1e1259',//250°, 80%, 35%
              100: '#2f1982',//253°, 83%, 44%
              200: '#341387',//257°, 86%, 53%
              300: '#4412a1',//261°, 89%, 63%
              400: '#580fbd',//265°, 92%, 74%
              500: '#6d0bd8',//269°, 95%, 85%
              600: '#a866ff',
              700: '#d1adff',
              800: '#e8d6ff',
              900: '#f5edff',
              DEFAULT: '#6d0bd8',
              foreground: '#ffffff'
            },
            secondary: {
              DEFAULT: '#bef781',
              foreground: COLORS.purpleDark
            },
            danger: {
              DEFAULT: '#ff5252',
            },
            focus: '#a866ff'
          } // light theme colors
        },
        dark: {
          layout: {}, // dark theme layout tokens
          colors: {} // dark theme colors
        },
        modern: {
          extend: 'dark', // <- inherit default values from dark theme
          colors: {
            'bg-gradiente-inicial': '#0e0326',
            'bg-gradiente-final': '#1b0747',
            background: '#150636',
            foreground: '#ffffff',
            secondary: {
              50: '#1e1259',//250°, 80%, 35%
              100: '#2f1982',//253°, 83%, 44%
              200: '#341387',//257°, 86%, 53%
              300: '#4412a1',//261°, 89%, 63%
              400: '#580fbd',//265°, 92%, 74%
              500: '#6d0bd8',//269°, 95%, 85%
              600: '#a866ff',
              700: '#d1adff',
              800: '#e8d6ff',
              900: '#f5edff',
              DEFAULT: '#6d0bd8',
              foreground: '#ffffff'
            },
            primary: {
              300: '#bef781',
              500: COLORS.green,
              600: '#47960b',
              DEFAULT: COLORS.green,
              foreground: COLORS.purpleDark
            },
            danger: {
              DEFAULT: '#bf3b3b',
            },
            focus: '#a866ff'
          },
          layout: {
            disabledOpacity: '0.3',
            radius: {
              small: '1px',
              medium: '2px',
              large: '4px'
            },
            borderWidth: {
              small: '1px',
              medium: '2px',
              large: '3px'
            }
          }
        }
      }
    })
  ],
}