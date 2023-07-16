import base from './rollup.config.base.mjs'

const config = Object.assign({}, base, {
    output: {
        name: 'big-file-upload',
        file: 'dist/big-file-upload.esm.js',
        format: 'es',
        sourcemap: true,
    },
    external: [
        ...base.external,
    ]
})


export default config