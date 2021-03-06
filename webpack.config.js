"use strict";

const merge = require("webpack-merge");
const path = require("path");
const webpack = require("webpack");

const configureCopy = require("./webpack/copy");
const configureFont = require("./webpack/font");
const configurePug = require("./webpack/pug");
const configureImg = require("./webpack/img");
const configureJS = require("./webpack/js");
const configureStyle = require("./webpack/style");
const configureClear = require("./webpack/clear");
const devServer = require("./webpack/server");
const s = require("./webpack.settings");

module.exports = (env) => {
  const isDev = env === "development";

  return merge(
    {
      // The base directory, an absolute path, for resolving
      // ENTRY POINTS and LOADERS from configuration.
      context: path.resolve(__dirname, s.src),

      entry: s.entries,

      output: {
        path: path.resolve(__dirname, s.dist),
        filename: s.distJS + "/" + s.fileName(isDev) + "js",
        chunkFilename: s.distJS + "/" + s.chunkFileName(isDev) +
        "js",
        publicPath: "/"
      }
    },

    isDev ? {
      mode: "development",
      devtool: "inline-source-map"
      // devtool: "cheap-module-eval-source-map"
    } : {
      mode: "production",
      devtool: "source-map"
    }, {

      resolve: {
        alias: {
          "@node": path.resolve(__dirname, "src/node_modules"),
          "@pug": path.resolve(__dirname, "src/pug"),
          "@js": path.resolve(__dirname, "src/js"),
          "@styles": path.resolve(__dirname, "src/styles"),
          "@images": path.resolve(__dirname, "src/images"),
          "@components": path.resolve(__dirname,
            "src/components")
        }
      },

      optimization: {
        splitChunks: {
          chunks: "all",
          minSize: 30000,
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 6,
          maxInitialRequests: 4,
          automaticNameDelimiter: "~",
          // default: {
          //   minChunks: 2,
          //   priority: -20,
          //   reuseExistingChunk: true
          // },
          cacheGroups: {
            defaultVendors: {
              name: "vendors",
              test: /node_modules/,
              // или можно более конкретно
              // test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              enforce: true
            },
            common: {
              name: "common"
              // chunks: "initial",
            }
          }
        },
        // запрет компиляции бандла при ошибке
        noEmitOnErrors: true
      },

      // ускорение сборки отменой парсинга файлов больших
      // библиотек, которые в этом случае не должны содержать
      // require, import, define и др. механизмы импорта
      module: {
        noParse: /jquery|bootstrap|popper.js/
      },

      plugins: [
        // корректно строим карту при SCSS-файлах
        new webpack.SourceMapDevToolPlugin({
          filename: "[file].map"
        }),
        // для доступа к обозначенной переменной
        // в коде проекта вне Webpack
        new webpack.DefinePlugin({
          ENV: JSON.stringify(isDev ?
            "development" : "production")
        })
      ]
    },
    configureCopy(),
    configureFont(),
    configurePug(),
    configureImg(isDev),
    configureJS(),
    configureStyle(isDev),
    isDev ? devServer() : configureClear()
  );
};


// может понадобиться:
//--------------------

/*
const WebpackMd5Hash = require("webpack-md5-hash");
new WebpackMd5Hash() // <- в разделе plugins
*/

/*
  // автоматически подключает библиотеки, встечающиеся в коде
new webpack.ProvidePlugin({ // <- в раздел plugins
  $: "jquery",
  jQuery: "jquery"
  })
*/
