/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-dark": "#001B48",
        primary: "#02457A",
        accent: "#018ABE",
        light: "#97CADB",
        "extra-light": "#D6E8EE",
      }
    },
  },
  plugins: [],
}
