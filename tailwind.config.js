/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Colores personalizados estilo Cali Smart City
      colors: {
        slate: {
          950: '#020617',
        }
      }
    },
  },
  plugins: [],
}