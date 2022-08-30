const path = require('path')
const common = require('./webpack.common')
const { merge } = require('webpack-merge')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'production',
  output: {
    publicPath: '/',
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, '../', 'dist'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API': JSON.stringify('https://api.smt-calc.com'), // https://api.smt-calc.com or https://smt-calc.herokuapp.com
    }),
  ],
})
