import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

import { version } from './package.json'

const banner = `/**
* verificator v${version}
* (c) ${new Date().getFullYear()} Nikita Stenin
* @license MIT
*/`

const env = process.env.NODE_ENV
const name = env === 'production' ? 'verificator.min' : 'verificator'

const config = {
    input: 'es/index.js',
    output: {
        file: `dist/${name}.js`,
        name: 'Verificator',
        format: 'umd',
        exports: 'named',
        banner
    },
    plugins: [
        nodeResolve({
            jsnext: true,
            browser: true,
            main: true,
            module: true
        }),
        commonjs(),
        babel(),
    ],
}

if (env === 'production') {
    config.plugins.push(
        uglify({
            compress: {
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                warnings: false
            }
        })
    )
}

export default config