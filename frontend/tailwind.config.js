/** @type {import('tailwindcss').Config} */

const flowbite = require("flowbite-react/tailwind");

export default {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
    flowbite.content(),

  ],
  theme: {
    extend: {
      width: {
        'content': '40rem',
      },
      animation: {
        bounce: 'bounce 1s infinite',
      },
      keyframes: {
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-70%)',
            'animation-timing-function': 'cubic-bezier(1,0,1,1)',
          },
          '50%': {
            transform: 'none',
            'animation-timing-function': 'cubic-bezier(0,0,0.2,1)',
          },
        },
      },
    },
  },
  plugins: [
    flowbite.plugin(),

    function ({ addUtilities }) {
      addUtilities({
        '.delay-100': {
          'animation-delay': '100ms',
        },
        '.delay-200': {
          'animation-delay': '200ms',
        },
        '.delay-300': {
          'animation-delay': '300ms',
        },
      });
    },
  ],

}
