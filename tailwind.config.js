/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        retask: {
          bg: "#050705",
          surface: "#0B100D",
          surfaceLight: "#101712",
          surfaceBorder: "#1A261E",
          surfaceHover: "#152019",
          darkGreen: "#0B5D3B",
          primaryGreen: "#19C37D",
          neonGlow: "#22E595",
          textLight: "#E8F0EA",
          textMuted: "#829188",
          textDim: "#4B5850",
          urgentRed: "#FF4757",
          urgentBg: "#2A0E13",
          highOrange: "#FFA502",
          highBg: "#2B1D06",
          mediumBlue: "#1E90FF",
          mediumBg: "#0B1C2E",
          lowGray: "#747D8C",
          lowBg: "#16191D",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "Courier New", "monospace"],
      },
      boxShadow: {
        'neo-green': '0 0 15px rgba(25, 195, 125, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'neo-green-glow': '0 0 25px rgba(25, 195, 125, 0.4), 0 0 5px rgba(34, 229, 149, 0.8)',
        'neo-card': '0 4px 20px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.8)',
        'neo-btn': 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 3px 6px rgba(0, 0, 0, 0.6)',
        'neo-btn-pressed': 'inset 0 2px 4px rgba(0, 0, 0, 0.8), 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
};
