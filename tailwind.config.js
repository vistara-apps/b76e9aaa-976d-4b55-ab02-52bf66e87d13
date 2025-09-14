/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(210, 30%, 95%)',
        foreground: 'hsl(210, 30%, 15%)',
        accent: 'hsl(130, 60%, 45%)',
        primary: 'hsl(210, 80%, 50%)',
        surface: 'hsl(0, 0%, 100%)',
        'civic-blue': 'hsl(200, 80%, 60%)',
        'civic-blue-dark': 'hsl(200, 80%, 50%)',
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
      },
      spacing: {
        'xl': '24px',
        'lg': '16px',
        'md': '8px',
        'sm': '4px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(210, 30%, 15%, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
