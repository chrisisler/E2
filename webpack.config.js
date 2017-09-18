const path = require('path')
// const WebpackDashboardPlugin = require('webpack-dashboard/plugin')

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

  // , plugins: [
  //   new WebpackDashboardPlugin()
  // ]
}
