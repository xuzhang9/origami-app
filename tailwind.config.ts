import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'origami-purple': '#8B5CF6',
        'origami-pink': '#EC4899',
        'origami-blue': '#3B82F6',
        'origami-green': '#10B981',
        'origami-yellow': '#FBBF24',
        'origami-orange': '#F97316',
      },
      fontFamily: {
        'kid': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
