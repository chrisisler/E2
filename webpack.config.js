// TODO Add webpack-dashboard-plugin

const path = require('path')

module.exports = {
    entry: './src/index.js'

    , output: {
        path: path.join(__dirname, 'build')
        , filename: 'bundle.js'
    }
    , module: {
        rules: [
            {
                test: /\.jsx?$/i
                , loader: 'babel-loader'
                , exclude: /node_modules/
                , options: {
                    presets: ['env']
                    , plugins: [
                        ['transform-react-jsx', { pragma: 'h' }]
                        , ['transform-class-properties']
                        , ['transform-object-rest-spread']
                    ]
                }
            }
        ]
    }

    // server
    , devServer: {
        contentBase: path.join(__dirname, 'src')
        , compress: true // gzip
        // , historyApiFallback: true // idk what this is
    }

    , target: 'node'
    // , target: 'electron-main'
}
