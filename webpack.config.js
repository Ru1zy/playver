const path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    hashFunction: 'sha256',
    filename: 'script.js',
    path: path.resolve(__dirname, './dist')
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { esmodules: true } }]
            ],
          },
        },
          exclude: /node_modules/,
        }
    ]
  }
}