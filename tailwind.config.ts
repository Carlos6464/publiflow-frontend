import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mapeando as classes do Tailwind para as variáveis CSS do globals.css
        brand: {
          primary: "var(--brand-primary)",
          secondary: "var(--brand-secondary)",
          dark: "var(--brand-dark)",
          surface: "var(--brand-surface)",
          text: "var(--brand-text)",
          white: "var(--brand-white)",
        },
      },
    },
  },
  plugins: [],
};
export default config;