/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: 'var(--accent)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        border: 'var(--border)',
      },
      fontFamily: {
        sans: ['"JetBrains Mono"', 'monospace'], // User requested JetBrains for whole site
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      maxWidth: {
        'app': '48rem', // 768px
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '68ch',
            color: 'rgb(var(--color-fill))',
            a: {
              color: 'rgb(var(--color-accent))',
              '&:hover': {
                color: 'rgb(var(--color-accent))',
              },
            },
          },
        },
      },
    },
  },
  darkMode: ['class', '[data-theme="dark"]'],
  plugins: [
    nextui(),
    require('@tailwindcss/typography'),
  ]
}
