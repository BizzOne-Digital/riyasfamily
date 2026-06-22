/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#af101a',
        'primary-container': '#d32f2f',
        'on-primary': '#ffffff',
        secondary: '#964900',
        'secondary-container': '#fc820c',
        'on-secondary': '#ffffff',
        tertiary: '#575757',
        'on-tertiary': '#ffffff',
        background: '#fff9f0',
        'on-background': '#1d1b16',
        surface: '#fff9f0',
        'on-surface': '#1d1b16',
        'on-surface-variant': '#5b403d',
        'surface-container': '#f3ede4',
        'surface-container-low': '#f9f3ea',
        'surface-container-high': '#ede7df',
        'surface-container-highest': '#e7e2d9',
        'outline': '#8f6f6c',
        'outline-variant': '#e4beba',
        error: '#ba1a1a',
      },
      fontFamily: {
        headline: ['"Playfair Display"', 'serif'],
        body: ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
