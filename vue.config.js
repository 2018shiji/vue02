module.exports = {
  publicPath: './',
  devServer:{
                      proxy:{
                        '^/api':{
                          target:'http://localhost:8083',
                          changeOrigin: true,
                          pathRewrite:{
                            '^/api':''
                          }
                        }
                      }
  }
}