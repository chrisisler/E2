// todo, use es7 stage-1 for class prop initialziers, i.e.: arrow funcs in `class`

const path = require('path')

// https://egghead.io/lessons/react-configure-webpack-2-and-babel-for-use-with-preact
module.exports = {
  entry: './src/index.js'

  , output: {
    path: path.join(__dirname, 'build')
    , filename: 'bundle.js'
  }
  , module: {
    rules: [ {
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
    }, {
      test: /\.css$/
      , use: [ 'style-loader', 'css-loader' ]
    } ]
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
