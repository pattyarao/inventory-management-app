/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'almost-white': '#F1F3F8',
        'blue-gray': '#D6E0F0',
        'gray-main': '#8D93AB',
        'dark-gray': '#393B44'
      }
    },
  },
  plugins: [],
};
