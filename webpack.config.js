var webpack = require('webpack');
var path = require('path')

const { NODE_ENV } = process.env;

const plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  }),
];

const filename = `text-adventure-game${NODE_ENV === 'production' ? '.min' : ''}.js`;

NODE_ENV === 'production'  && plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      screw_ie8: true,
      warnings: false,
    },
  })
);

module.exports = {
  module: {
    loaders: [
      { 
        test: /\.js$/, 
        loader: 'babel-loader', 
        exclude: /node_modules/
      },
    ],
  },

  entry: [
    './src/index',
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename,
    library: 'Text Adventure Game Engine',
    libraryTarget: 'umd',
  },

  plugins,
};