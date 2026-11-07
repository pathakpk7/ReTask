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
          bg: "#08090A",
          surface: "#0F1216",
          surfaceLight: "#161B22",
          surfaceBorder: "rgba(255, 255, 255, 0.08)",
          surfaceHover: "#1C222B",
          darkGreen: "#065F46",
          primaryGreen: "#10B981",
          neonGlow: "#34D399",
          textLight: "#F3F4F6",
          textMuted: "#9CA3AF",
          textDim: "#6B7280",
          urgentRed: "#EF4444",
          urgentBg: "rgba(239, 68, 68, 0.14)",
          highOrange: "#F59E0B",
          highBg: "rgba(245, 158, 11, 0.14)",
          mediumBlue: "#3B82F6",
          mediumBg: "rgba(59, 130, 246, 0.14)",
          lowGray: "#9CA3AF",
          lowBg: "rgba(156, 163, 175, 0.1)",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
      },
    },
  },
  plugins: [],
};
