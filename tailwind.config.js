/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        noirBg: "#111418",
        noirCard: "#1d282d",
        noirMint: "#baffd8",
        noirCyan: "#96dded",
        noirText: "#fcfcfc",
      },
      fontFamily: {
        noir: ["Noir-Regular"],
        "noir-medium": ["Noir-Medium"],
      },
    },
  },
  plugins: [],
};

