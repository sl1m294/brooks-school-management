export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f7f3ea",
        charcoal: "#11110f",
        graphite: "#2b2c28",
        leaf: "#1f6f4a",
        crest: "#b88a2d",
        skywash: "#dbeaf0",
        chalk: "#fffaf0"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        editorial: "0 24px 80px rgba(17, 17, 15, 0.16)"
      }
    }
  },
  plugins: []
};
