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
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          fill: 'hsl(var(--destructive-fill))',
          foreground: 'hsl(var(--destructive-foreground))',
          border: 'hsl(var(--destructive-foreground) / 0.2)',
        },
        warn: {
          DEFAULT: 'hsl(var(--warn))',
          accent: 'hsl(var(--warn-accent))',
          fill: 'hsl(var(--warn-fill))',
          foreground: 'hsl(var(--warn-foreground))',
          border: 'hsl(var(--warn-foreground) / 0.2)',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          accent: 'hsl(var(--success-accent))',
          fill: 'hsl(var(--success-fill))',
          foreground: 'hsl(var(--success-foreground))',
          border: 'hsl(var(--success-foreground) / 0.25)',
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
