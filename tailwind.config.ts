import type { Config } from 'tailwindcss'

const config: Config = {
  // Only scan files that actually use Tailwind classes
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],

  theme: {
    extend: {
      // ----------------------------------------
      // Typography
      // Geist Mono for all data/metric displays
      // ----------------------------------------
      fontFamily: {
        mono: [
          'Geist Mono',
          'JetBrains Mono',
          'Fira Code',
          'ui-monospace',
          'monospace',
        ],
        sans: [
          'Geist',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },

      // ----------------------------------------
      // Colors
      // Zinc base + emerald accent is the
      // SynqWorks v2 design language
      // ----------------------------------------
      colors: {
        // Semantic aliases so components stay
        // consistent across the product
        brand: {
          DEFAULT: '#10b981', // emerald-500
          dark:    '#059669', // emerald-600
          light:   '#d1fae5', // emerald-100
        },
        danger: {
          DEFAULT: '#f43f5e', // rose-500
          light:   '#ffe4e6', // rose-100
        },
        warn: {
          DEFAULT: '#f59e0b', // amber-500
          light:   '#fef3c7', // amber-100
        },
      },

      // ----------------------------------------
      // Animation
      // Spin used for loading states throughout
      // ----------------------------------------
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },

      // ----------------------------------------
      // Border radius
      // Consistent rounding across all cards
      // ----------------------------------------
      borderRadius: {
        xl:  '0.75rem',
        '2xl': '1rem',
      },

      // ----------------------------------------
      // Box shadow
      // Subtle card elevation only —
      // no dramatic shadows per design system
      // ----------------------------------------
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
      },
    },
  },

  plugins: [],
}

export default config