/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages//*.{html,js,jsx,ts,tsx}',
    './src/components//*.{html,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        while: '#FFFFFF',
        black: '#111111',
        red: '#FF0000',
        green_800: '#04373B',
        green_500: '#076267',
        green_400: '#046F75',
        green_300: '#0E848A',
        green_200: '#36C2CC',
        green_100: '#B3E9EB',
        pink_300: '#FF7777',
        pink_200: '#FFA9A9',
        pink_100: '#FFD2D2',
        gray_500: '#9E9E9E',
        gray_400: '#B4B4B4',
        gray_300: '#DDDDDD',
        gray_200: '#EEEEEE',
        gray_100: '#F6F6F6',
      },
      fontSize: {
        // headings
        h1: ['32px', { fontWeight: '600' }],
        h2: ['24px', { fontWeight: '600' }],
        h3: ['20px', { fontWeight: '600' }],
        h4: ['18px', { fontWeight: '600' }],
        // paragraphs
        p1: ['16px', { fontWeight: '400' }],
        p2: ['14px', { fontWeight: '400' }],
        p3: ['14px', { fontWeight: '300', lineHeight: '1.6' }],
        smT: ['12px', { fontWeight: '400' }],
      },
    },
  },
  plugins: [],
};
