/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          maroon: '#7B1F2B',
          'maroon-light': '#A83242',
          'maroon-dark': '#5A1620',
        },
        secondary: {
          gold: '#C9A84C',
          'gold-light': '#E8D5A3',
          'gold-dark': '#A8873A',
        },
        accent: {
          orange: '#E86A2C',
          'orange-light': '#F5A06B',
          'orange-dark': '#C9541E',
        },
        background: {
          cream: '#FDF8F0',
          'cream-light': '#FFFDF8',
          'cream-dark': '#F5EDE0',
        },
        text: {
          dark: '#1C1C1C',
          'dark-light': '#3D3D3D',
          muted: '#7A7A7A',
        }
      },
      fontFamily: {
        heading: ['Cormorant Garamond', 'serif'],
        body: ['Poppins', 'sans-serif'],
        button: ['Outfit', 'sans-serif'],
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'slide-down': 'slideDown 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'rotate-in': 'rotateIn 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        rotateIn: {
          '0%': { transform: 'rotate(-10deg) scale(0.9)', opacity: 0 },
          '100%': { transform: 'rotate(0) scale(1)', opacity: 1 },
        },
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #7B1F2B 0%, #C9A84C 50%, #E86A2C 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FDF8F0 0%, #F5EDE0 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C9A84C 0%, #E8D5A3 100%)',
        'gradient-maroon': 'linear-gradient(135deg, #7B1F2B 0%, #5A1620 100%)',
      },
      boxShadow: {
        'luxury': '0 20px 60px rgba(123, 31, 43, 0.15)',
        'gold': '0 10px 40px rgba(201, 168, 76, 0.3)',
        'soft': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'elevated': '0 30px 80px rgba(123, 31, 43, 0.12)',
      },
      letterSpacing: {
        'widest': '.25em',
        'ultra': '.4em',
      },
    },
  },
  plugins: [],
}
