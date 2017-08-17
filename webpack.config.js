const { join } = require('path')

// https://egghead.io/lessons/react-configure-webpack-2-and-babel-for-use-with-preact
module.exports = {

    entry: './src'

    , output: {
        path: join(__dirname, 'build')
        , filename: 'bundle.js'
    }

    , module: {
        rules: [
            {
                test: /\.jsx?$/i
                , loader: 'babel-loader'
                , options: {
                    presets: ['env']
                    , plugins: [
                        ['transform-react-jsx', { pragma: 'h' }]
                    ]
                }
            }
        ]
    }

    , devtool: 'source-map'

    , devServer: {
        contentBase: join(__dirname, 'src')
        , compress: true
        , historyApiFallback: true
    }
    // , target: 'electron'
}
