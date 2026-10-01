import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        palladian: "#EEE9DF",
        oatmeal: "#C9C1B1",
        fantastic: "#2C3B4D",
        flame: "#FFB162",
        truffle: "#A35139",
        abyss: "#1B2632",
      },
    },
  },
  plugins: [],
};
export default config;
