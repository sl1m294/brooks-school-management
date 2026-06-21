export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f9fb",
          100: "#edf1f5",
          200: "#d9e1ea",
          500: "#607084",
          700: "#334155",
          900: "#111827"
        },
        meadow: {
          50: "#edfdf5",
          100: "#d6f7e6",
          600: "#16875a",
          700: "#126c4a"
        },
        sun: {
          100: "#fff0c2",
          500: "#d89100"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(17, 24, 39, 0.08)"
      }
    }
  },
  plugins: []
};

