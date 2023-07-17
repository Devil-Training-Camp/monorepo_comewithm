import {babel} from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import cjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default {
    input: 'src/index.ts',
    plugins: [
        resolve({
            mainFields: ['module', 'jsnext', 'main', 'browser']
        }),
        babel({
            exclude: 'node_modules/**',
            extensions: ['.js', '.ts', '.jsx', '.tsx'],
            babelHelpers: 'bundled'
        }),
        cjs({
            include: /node_modules/
        }),
        postcss({ 
            plugins: [autoprefixer()]
        }),
        replace({
            preventAssignment: true
        }),
        dts(),
        typescript(),
    ],
    watch: {
        include: 'src/**'
    },
    external: ['react', 'react-dom']
}