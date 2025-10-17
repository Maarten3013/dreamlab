// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shine: { to: { transform: "translateX(120%)" } },
      },
      animation: {
        "fade-in": "fadeIn 500ms ease-out both",
        shine: "shine 1.2s ease-out 1",
      },
    },
  },
  plugins: [],
};
