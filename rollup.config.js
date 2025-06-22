import appkit from '@keithclark/rollup-plugin-appkit';
import terser from '@rollup/plugin-terser';
import pkg from './package.json' with { type: 'json' };
// eslint-disable-next-line no-undef
const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
  context: 'this',
  output: {
    file: 'dist/richinput.js',
    format: 'esm',
    sourcemap: !production,
  },
  plugins:[
    appkit(),
    production && terser({
      format: {
        preamble: `/*! ${pkg.name} v${pkg.version} - ${pkg.author} - ${pkg.license} license */`
      }
    })
  ]
}

