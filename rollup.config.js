import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

import tailwind from 'tailwindcss'
import postcss from 'rollup-plugin-postcss'
import purgeCss from '@fullhuman/postcss-purgecss'
import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'

const production = !process.env.ROLLUP_WATCH;
const removeUnusedCss = purgeCss({
  content: ['./src/**/*.html', './src/**/*.svelte'],
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
})

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/bundle.js'
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      emitCss: true,
    }),
    postcss({
      plugins: [
        postcssImport,
        tailwind(),
        autoprefixer,
        production && removeUnusedCss,
      ].filter(Boolean),
      extract: 'public/bundle.css',
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({
      browser: true,
      dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
    }),
    commonjs(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};
