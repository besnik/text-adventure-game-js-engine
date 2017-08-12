"use strict"
var path = require('path')
console.log(path.resolve(__dirname, '..', 'lib'))
module.exports = {
  entry: ['./app'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/js'),
    publicPath: '/js/'
  },
  module: {
    loaders: [
      {
        test: /(\.js|\.jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [require('babel-preset-es2015'), require('babel-preset-react'), require('babel-preset-stage-2')]
        }
      },
      {
        test: /(\.css|\.scss)$/,
        loaders: [
          require.resolve('style-loader'),
          require.resolve('css-loader') + '?sourceMap',
          require.resolve('sass-loader') + '?sourceMap'
        ]
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'file-loader?name=images/[name].[ext]'
      }
    ]
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'node_modules'),],
    extensions: ['.js', '.jsx', '.scss', '.css']
  }
}

