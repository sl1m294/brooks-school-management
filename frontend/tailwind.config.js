export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#fbf7ef",
          100: "#f2eadf",
          200: "#ded2c4",
          500: "#6f7788",
          700: "#15213d",
          900: "#07142f"
        },
        meadow: {
          50: "#fff1f2",
          100: "#f7d8dc",
          600: "#7b101b",
          700: "#5f0b14"
        },
        sun: {
          100: "#fff2c9",
          500: "#f3c955"
        }
      },
      boxShadow: {
        soft: "0 22px 60px rgba(7, 20, 47, 0.12)"
      }
    }
  },
  plugins: []
};
