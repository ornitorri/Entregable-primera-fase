import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['"DM Sans"', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
        dmsans: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        parchment: 'hsl(var(--parchment))',
        cream: 'hsl(var(--background))',
        ink: 'hsl(var(--foreground))',
        charcoal: 'hsl(var(--charcoal))',
        muted: 'hsl(var(--muted))',
        warm: 'hsl(var(--warm))',
        sage: 'hsl(var(--sage))',
        rust: 'hsl(var(--rust))',
        amber: {
          DEFAULT: 'hsl(var(--accent))',
          hover: '#a36d08',
          pale: '#fdf3d0',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        border: 'hsl(var(--border))',
      },
      spacing: {
        'nav': '80px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        rotateSlow: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-down": "slideDown 0.6s ease-out forwards",
        "rotate-slow": "rotateSlow 30s linear infinite",
        "shake": "shake 0.3s ease-in-out",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "float-slow": "float 8s ease-in-out 1s infinite",
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;