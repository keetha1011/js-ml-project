/** @type {import('tailwindcss').Config} */

const config = {
  darkMode: ['class'],
  content: ['./src/**/*.{html,js,svelte,ts}'],
  // safelist: ['dark'],
  theme: {
    extend: {
      fontFamily: {
        caveat: ["Caveat", "sans-serif"],
      }
    }
  }
}

export default config;