/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        'primary': {
          'DEFAULT': '#2F3E44',
          '50': '#f3f8f8',
          '100': '#e0eced',
          '200': '#c4dadd',
          '300': '#9bbfc5',
          '400': '#6b9da5',
          '500': '#4f818b',
          '600': '#456b75',
          '700': '#3c5a62',
          '800': '#374c53',
          '900': '#2f3e44',
          '950': '#1d2a2f',
        },
        'secondary': {
          'DEFAULT': '#994636',
          '50': '#f9f6ed',
          '100': '#f0e8d1',
          '200': '#e2d0a6',
          '300': '#d0b374',
          '400': '#c2984d',
          '500': '#b2833f',
          '600': '#9a6834',
          '700': '#7b4e2d',
          '800': '#68412b',
          '900': '#5a3829',
          '950': '#331d15',
        },
        'salem': {
          '50': '#effaf4',
          '100': '#d8f3e2',
          '200': '#b3e7c9',
          '300': '#82d3aa',
          '400': '#4eb987',
          '500': '#2b9e6c',
          '600': '#1c7c54',
          '700': '#176547',
          '800': '#14513a',
          '900': '#124230',
          '950': '#09251b',
          'DEFAULT': '#1c7c54'
        },
        'black': '#171E20',
        'white': '#E8EEDA'
      },
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

