/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        govBlue: '#0B3C6F',
        govLightBlue: '#E6F0FA',
        govBorder: '#CBD5E1',
        govWarning: '#F59E0B',
        govDanger: '#DC2626',
        govSuccess: '#16A34A'
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      }
    }
  },
  plugins: [],
}
