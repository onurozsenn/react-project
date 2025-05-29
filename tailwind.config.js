/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        fontFamily: {
          sans: ['"Open Sans"', 'sans-serif'],
          bebas: ['"Bebas Neue"', 'sans-serif'],
        },
        keyframes: {
          fadeLoop: {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0' },
          },
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-12px)' },
          },
        },
        animation: {
          fadeLoop: 'fadeLoop 6s ease-in-out infinite',
          float: 'float 6s ease-in-out infinite',
        },
      },
    },
    plugins: [],
  };
  