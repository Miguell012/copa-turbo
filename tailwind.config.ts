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
        copa: {
          green: "#009739",
          "green-dark": "#007a2f",
          yellow: "#FEDD00",
          "yellow-dark": "#e5c700",
          blue: "#002776",
          "blue-light": "#1a3d9e",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px -4px rgba(0, 39, 118, 0.12)",
        "card-hover": "0 8px 32px -4px rgba(0, 39, 118, 0.18)",
      },
      backgroundImage: {
        "copa-gradient":
          "linear-gradient(135deg, #002776 0%, #009739 50%, #002776 100%)",
        "hero-pattern":
          "radial-gradient(circle at 20% 80%, rgba(254, 221, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0, 151, 57, 0.2) 0%, transparent 50%)",
      },
    },
  },
  plugins: [],
};

export default config;
