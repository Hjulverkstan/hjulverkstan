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
      'stats-value': [
        '80px',
        {
          lineHeight: '75px',
          letterSpacing: '-0.96px',
          fontWeight: '700',
        },
      ],
      fontFamily: {
        inter: ['Bricolage Grotesque', 'sans-serif'],
        'dm-mono': ['DMMono', 'Courier New'],
        bricolage: ['"Bricolage Grotesque"', 'sans-serif'],
      },
      fontSize: {
        display: [
          '60px',
          {
            lineHeight: '60px',
            letterSpacing: '-0.72px',
          },
        ],
        'stats-value': [
          '80px',
          {
            lineHeight: '75px',
            letterSpacing: '-0.96px',
            fontWeight: '700',
          },
        ],
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
      backgroundImage: {
        'warm-gradient':
          'linear-gradient(97deg, #FC6A82 1.89%, #F74284 122.8%)', //pinkish
        'blue-gradient':
          'linear-gradient(94deg, #57ADF9 -20.59%, #A274FD 144.82%)', //blueish/purplish
        lightPink: "url('/images/LightpinkMidsec.jpg')",
        pink: "url('/images/backgroundLightPink.jpg')",
        blue: 'linear-gradient(180deg, rgba(0, 0, 0, 0.08) 5.41%, rgba(0, 0, 0, 0.00) 62.48%), linear-gradient(118deg, #E09CF7 15.26%, #B887FC 44.03%, #64A3F9 85.66%)',
        peach: 'linear-gradient(95deg, #FF877C 17.49%, #FF669E 78.02%)',
      },
      boxShadow: {
        'pink-blur': '0 0 69.1px 0 rgba(95, 17, 58, 0.10)',
        'bottom-1': '0 0.5px 0 0 hsl(var(--border))',
      },
      borderRadius: {
        button: '77px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        hjul: {
          dark: '#4A2A0B',
          muted: '#927C6B',
          plum: '#6D024C',
        },
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
          DEFAULT: 'hsl(var(--blue))',
          fill: 'hsl(var(--blue-fill))',
          muted: 'hsl(var(--blue-muted))',
          foreground: 'hsl(var(--blue-foreground))',
          border: 'hsl(var(--blue-foreground) / 0.25)',
        },
        purple: {
          DEFAULT: 'hsl(var(--purple))',
          fill: 'hsl(var(--purple-fill))',
          foreground: 'hsl(var(--purple-foreground))',
          border: 'hsl(var(--purple-foreground) / 0.25)',
        },
        brown: {
          DEFAULT: 'hsl(var(--brown))',
          accent: 'hsl(var(--brown-accent))',
          border: 'hsl(var(--brown) / 0.25)',
        },

        plum: {
          DEFAULT: 'hsl(var(--plum))',
          accent: 'hsl(var(--plum-accent))',
          border: 'hsl(var(--plum) / 0.25)',
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
