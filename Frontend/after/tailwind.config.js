/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        white: '#FFFFFF',
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
        h1: ['3em', { fontWeight: '600' }],
        h2: ['2.5em', { fontWeight: '600' }],
        h3: ['2em', { fontWeight: '600' }],
        h4: ['1.8em', { fontWeight: '600' }],

        // paragraphs
        p1: ['1.4em', { fontWeight: '400' }],
        p2: ['1.2em', { fontWeight: '400' }],
        p3: ['1.2em', { fontWeight: '300', lineHeight: '1.6' }],
        smT: ['1em', { fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}
