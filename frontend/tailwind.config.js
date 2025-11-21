/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <--- Important for App.jsx and other components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}