import fs from 'fs'
import path from 'path'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

const localesDir = path.join(__dirname, 'es/locale')
const files = fs.readdirSync(localesDir)

const configs = []

for (let file of files) {
    if (/\.d.ts/.test(file)) {
        continue
    }

    const name = path.basename(file, '.js')

    configs.push({
        input: path.join(__dirname, 'es/locale', file),
        output: {
            file: path.join(__dirname, 'dist/locale', file),
            name: `VerificatorLocale.${name}`,
            format: 'umd',
            exports: 'named',
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
            uglify({
                compress: {
                    pure_getters: true,
                    unsafe: true,
                    unsafe_comps: true,
                    warnings: false
                }
            })
        ],
    })
}

export default configs