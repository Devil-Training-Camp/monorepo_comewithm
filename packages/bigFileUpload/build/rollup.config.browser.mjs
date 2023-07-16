import base from './rollup.config.base.mjs'
import {terser} from 'rollup-plugin-terser'

const config = Object.assign({}, base, {
    output: {
        exports: 'named',
        name: 'BigFileUpload',
        file: 'dist/big-file-upload.min.js',
        format: 'iife',
        sourcemap: true,
        globals: {
            react: 'React'
        }
    }
})

config.plugins.push(terser())

export default config