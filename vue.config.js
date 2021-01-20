const webpack = require("webpack");
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}
// 环境变量注入
// function findActiveEnvConfig () {
//   const env = process.env.VUE_APP_BUILD_ENV
//   return JSON.stringify(config[env])
// }
console.log("process.env.VUE_APP_BUILD_ENV:", process.env.VUE_APP_BUILD_ENV);
const proxyMap = {
  development: {
    "/ms": {
      target: "http://localhost:8080",
      changeOrigin: true,
    },
  },
};
// const configure = findActiveEnvConfig()
const publicPath = "/mybot/";

module.exports = {
  publicPath: process.env.NODE_ENV === "development" ? "/" : publicPath,
  lintOnSave: true,
  pages: {
    index: {
      entry: "src/main.js",
      filename: "index.html",
      //   title: titleObj[process.env.NODE_ENV]
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias.set("@", resolve("src"));
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        // 'process.env.CONFIG': configure,
        "process.env.FORBIDDEN_SSO": process.env.FORBIDDEN_SSO,
        "process.env.VUE_APP_BUILD_ENV": process.env.VUE_APP_BUILD_ENV,
      }),
      //   new CopyWebpackPlugin([
      //     {
      //       from: path.resolve(__dirname, './src/utils'),
      //       to: path.resolve(__dirname, './dist/js/utils')
      //     }
      //   ])
    ],
  },
  devServer: {
    host: "127.0.0.1",
    port: 8010,
    proxy: proxyMap[process.env.NODE_ENV],
  },
};
