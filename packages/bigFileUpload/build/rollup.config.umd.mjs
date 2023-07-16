import base from './rollup.config.base.mjs';

const config = Object.assign({}, base, {
  output: {
    name: 'big-file-upload',
    file: 'dist/big-file-upload.umd.js',
    format: 'umd',
    sourcemap: true,
  },
})

export default config;