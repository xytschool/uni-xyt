module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  //outputDir: 'dist',
  outputDir: '/data/go/src/github.com/gw123/echo-app/resources/public/m',
  //outputDir: '../public',
  assetsDir:  process.env.APP_VERSION ? process.env.APP_VERSION :'',
  indexPath: 'index.html',
  filenameHashing: false,
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: true,
}
