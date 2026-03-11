/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#0a0a0a',
        surface:  '#111111',
        card:     '#141414',
        border:   'rgba(255,255,255,0.07)',
        borderh:  'rgba(255,255,255,0.14)',
        text:     '#f0f0f0',
        muted:    '#555555',
        muted2:   '#888888',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        sans:    ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        blink:    'blink 2.5s ease infinite',
        float:    'float 6s ease-in-out infinite alternate',
        shimmer:  'shimmer 1.6s ease infinite',
        fadeUp:   'fadeUp 0.5s ease both',
        spin:     'spin 0.7s linear infinite',
      },
      keyframes: {
        blink:   { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.2' } },
        float:   { '0%': { transform: 'translateY(0) rotate(-0.8deg)' }, '100%': { transform: 'translateY(-10px) rotate(0.8deg)' } },
        shimmer: { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
        fadeUp:  { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '56px 56px',
      },
    },
  },
  plugins: [],
}
