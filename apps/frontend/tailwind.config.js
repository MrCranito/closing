const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, './../../libs/**/!(*.stories|*.spec).{ts,html}'), // Include libs/
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Light mode colors
        primary: {
          DEFAULT: '#3B82F6', // Blue-500
          dark: '#1D4ED8',    // Blue-700
          light: '#60A5FA',   // Blue-400
        },
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F3F4F6',
        },
        text: {
          DEFAULT: '#111827', // Gray-900
          secondary: '#4B5563', // Gray-600
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-primeui'),
  ]
};
