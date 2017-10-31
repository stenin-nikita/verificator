const path = require('path')

module.exports = {
    devtool: 'cheap-module-source-map',

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
