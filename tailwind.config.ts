import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        spaceCadet: "var(--color-space-cadet)",
        uclaBlue: "var(--color-ucla-blue)",
        pinkLavender: "var(--color-pink-lavender)",
        cyanAzure: "var(--color-cyan-azure)",
        airSuperiority: "var(--color-air-superiority)",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
