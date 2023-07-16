import {babel} from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import cjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'

export default {
    input: 'src/index.ts',
    plugins: [
        resolve({
            mainFields: ['module', 'jsnext', 'main', 'browser']
        }),
        babel({
            exclude: 'node_modules/**'
        }),
        cjs({
            include: /node_modules/
        }),
        replace({
            preventAssignment: true
        })
    ],
    watch: {
        include: 'src/**'
    },
    external: ['react', 'react-dom']
}