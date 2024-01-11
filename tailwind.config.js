/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '2': 'repeat(2, minmax(0, 1fr))',
        '4': 'repeat(4, minmax(0, 1fr))',
        '8': 'repeat(8, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
        '32': 'repeat(32, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
}

