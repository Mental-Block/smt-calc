const common = require('./webpack.common')
const { merge } = require('webpack-merge')

module.exports = merge(common, {
  mode: 'development',
  output: {
    publicPath: '/',
  },
  devServer: {
    historyApiFallback: true,
    port: 8080,
    contentBase: '/src',
    inline: true,
    hot: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8082',
        pathRewrite: { '^/api': '' },
        secure: true,
        changeOrigin: true,
      },
    },
  },
})
