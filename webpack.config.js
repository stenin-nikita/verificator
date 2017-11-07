const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    devtool: 'source-map',

    entry: './src/index.ts',

    output: {
        library: 'verificator',
        libraryTarget: 'umd',
        filename: 'dist/verificator.js'
    },

    resolve: {
        extensions: ['.web.js', '.js', '.json', '.web.ts', '.ts'],
    },

    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true
                        }
                    },
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    },

    plugins: [
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    comparisons: false
                },
                output: {
                    comments: false,
                    ascii_only: true,
                },
                warnings: false
            }
        })
    ],

    devServer: {
        host: 'localhost',
        port: 8000,
        publicPath: '/',
        contentBase: [
            path.join(__dirname, 'public'),
            path.join(__dirname, 'dist')
        ],
        watchContentBase: true,
        watchOptions: {
            ignored: /node_modules/,
        },
        compress: true,
        quiet: false,
        noInfo: true
    }
}
