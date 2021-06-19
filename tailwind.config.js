module.exports = {
  purge: ['index.html', 'src/**/*.svelte'],
  darkMode: false,
  theme: {
    extend: {
      screens: {
        canhover: { raw: '(hover: hover)' }
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ['active']
    }
  },
  plugins: [require('@tailwindcss/aspect-ratio')]
}