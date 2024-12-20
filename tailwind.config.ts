import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      animation: {
        'bounce-left': 'bounce-left 1s ease-out',
        'bounce-left2': 'bounce-left2 1s ease-out infinite'
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        bgColor: '#18191a',
        boxColor: '#242526',
        btn: '#0866ff',
        bgLogin: '#f0f2f5',
        baseColor: '#5c2928',
        hoverColor: "#723d3c"
      },
    },
  },
  plugins: [],
};
export default config;
