/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#009688',
          light: '#4DB6AC',
          dark: '#00796B'
        },
        secondary: {
          DEFAULT: '#B3E5FC',
          light: '#E1F5FE',
          dark: '#81D4FA'
        },
        background: '#FFFFFF',
        text: '#424242',
        accent: {
          DEFAULT: '#A5D6A7',
          light: '#C8E6C9',
          dark: '#81C784'
        },
        alert: {
          DEFAULT: '#E57373',
          light: '#FFCDD2',
          dark: '#EF5350'
        }
      }
    },
  },
  plugins: [],
};