const configureAPI = require('./src/server/configure')

module.exports = {
  devServer: {
    before: configureAPI
  },
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/scss/base.scss";'
      }
    }
  }
}
