/** SDSA design system */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#002060', dark: '#001a4d', light: '#1a3d7c', 50: '#eef2fa' },
        accent: { DEFAULT: '#e0c040', dark: '#c9a227', light: '#f5e6a8' },
        success: '#2e7d32', danger: '#b03030', surface: '#f5f7fc'
      },
      fontFamily: { sans: ['Inter', 'Noto Sans Gujarati', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: []
};
