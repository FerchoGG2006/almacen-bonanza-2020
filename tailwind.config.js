/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,ts,js,tsx,jsx}", "./dist/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['"Syne"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        bonanza: {
          bg: '#F5F5F5',
          light: '#FAFAFA',
          surface: '#FFFFFF',
          border: '#EAEAEA',
          card: '#F4F4F4',
          muted: '#666666',
          dark: '#111111',
          black: '#0A0A0A'
        }
      }
    },
  },
  safelist: [
    { pattern: /^(bg|text|border|ring)-(bonanza|neutral|emerald|rose|amber|blue|slate)-/ },
    { pattern: /^(p|px|py|m|mx|my|gap|space)-/ },
    { pattern: /^(w|h|min-w|max-w)-/ },
    { pattern: /^(rounded|flex|grid|hidden|block|inline|relative|absolute|fixed)/ },
    'aspect-[4/5]', 'aspect-[4/3]', 'aspect-[3/4]', 'aspect-square', 'object-contain', 'object-cover', 'line-clamp-1', 'line-clamp-2',
    'bg-white', 'bg-black', 'text-white', 'text-black', 'shadow-2xl'
  ],
  plugins: [],
}
