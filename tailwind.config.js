/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
        secondary: {
          50: "#f9fafb",
          100: "#f3f4f6",
          500: "#6b7280",
        },
        success: "#34d399",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
  darkMode: "class",
}
