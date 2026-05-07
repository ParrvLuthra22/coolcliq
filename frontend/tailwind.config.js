/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Clash Display"', '"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: '#0A0A0F',
        graphite: '#13131A',
        carbon: '#1C1C26',
        smoke: '#2A2A36',
        ash: '#3A3A48',
        fog: '#9A9AAB',
        cream: '#F5F4EE',
        flame: '#FF3D71',     // primary magenta
        neon: '#C8FF5C',      // electric lime accent
        ice: '#5CE1FF',
      },
      boxShadow: {
        glow: '0 0 60px -10px rgba(255,61,113,.55)',
        soft: '0 8px 32px rgba(0,0,0,.35)',
      },
      animation: {
        'pulse-slow': 'pulseSlow 2.4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        pulseSlow: { '0%,100%': { opacity: 1 }, '50%': { opacity: .4 } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};
