/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1920px',
      },
    },
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        'dm-mono': ['DMMono', 'Courier New'],
      },
      fontWeight: {
        thin: '100',
        light: '250',
        normal: '350',
        medium: '450',
        semibold: '550',
        bold: '650',
        extrabold: '750',
        black: '850',
      },
      colors: {
        border: {
          DEFAULT: 'hsl(var(--border))',
          dark: 'hsl(var(--border-dark))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          border: 'hsl(var(--secondary-foreground) / 0.2)',
        },
        contrast: {
          DEFAULT: 'hsl(var(--contrast))',
          foreground: 'hsl(var(--contrast-foreground))',
        },
        red: {
          DEFAULT: 'hsl(var(--red))',
          fill: 'hsl(var(--red-fill))',
          foreground: 'hsl(var(--red-foreground))',
          border: 'hsl(var(--red-foreground) / 0.2)',
        },
        yellow: {
          DEFAULT: 'hsl(var(--yellow))',
          accent: 'hsl(var(--yellow-accent))',
          fill: 'hsl(var(--yellow-fill))',
          foreground: 'hsl(var(--yellow-foreground))',
          border: 'hsl(var(--yellow-foreground) / 0.2)',
        },
        green: {
          DEFAULT: 'hsl(var(--green))',
          accent: 'hsl(var(--green-accent))',
          fill: 'hsl(var(--green-fill))',
          foreground: 'hsl(var(--green-foreground))',
          border: 'hsl(var(--green-foreground) / 0.25)',
        },
        blue: {
          fill: 'hsl(var(--blue-fill))',
          foreground: 'hsl(var(--blue-foreground))',
          border: 'hsl(var(--blue-foreground) / 0.25)',
        },
        purple: {
          fill: 'hsl(var(--purple-fill))',
          foreground: 'hsl(var(--purple-foreground))',
          border: 'hsl(var(--purple-foreground) / 0.23)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },
      boxShadow: {
        'bottom-1': '0 0.5px 0 0 hsl(var(--border))', // Simulates a 1px bottom border
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
