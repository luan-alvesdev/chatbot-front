/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui'],
        dmsans: ['"DM Sans"', 'sans-serif'], // opcional, se quiser usar como font-dmsans
      },
    },
  },
  plugins: [],
}
