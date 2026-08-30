/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9edff",
          200: "#bce0ff",
          300: "#8ecdff",
          400: "#59b0ff",
          500: "#338dff",
          600: "#1a6df5",
          700: "#1357e1",
          800: "#1647b6",
          900: "#183f8f",
          950: "#142857"
        },
        dark: {
          800: "#1a1a2e",
          900: "#0f0f1a",
          950: "#08081a"
        }
      }
    }
  },
  plugins: []
};
