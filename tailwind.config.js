/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        neon: "#22c55e",
        gold: "#f4c95d"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        book: ["Crimson Text", "Georgia", "serif"]
      },
      boxShadow: {
        neon: "0 0 34px rgba(34, 197, 94, 0.22)"
      }
    }
  },
  plugins: []
};
