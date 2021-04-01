"use strict";

const path = require("path");
const s = require("../webpack.settings");

module.exports = function () {
  return {
    module: {
      rules: [{
        test: /\.js$/,
        include: [
          path.resolve(s.dir, s.src, s.srcJS),
          path.resolve(s.dir, s.src, s.srcComponents)
        ],
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                // набор плагинов для современного JS
                "@babel/preset-env"
              ],
              plugins: [
                // разрешаем использование асинхронных ф-ций
                "@babel/plugin-transform-runtime",
                // разрешаем присвоение членам класса
                // class Util {
                //  static id = Data.now()
                // }
                "@babel/plugin-proposal-class-properties"
              ],
              sourceMap: true
            }
          }, {
            loader: "eslint-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      }]
    }
  };
};


// Если настраивать оптимизацию вручную
//
// const TerserPlugin = require("terser-webpack-plugin");
//
//     optimization: {
//       // mast have for Terser and OptimizeCss Plugins!!!!
//       minimize: true,
//       minimizer: [
//         new TerserPlugin({
//           test: /\.js(\?.*)?$/i,
//           parallel: true,
//           cache: true,
//           sourceMap: true,
//           terserOptions: {
//             parse: {
//               // we want terser to parse ecma 8 code. However,
//               // we don't want it to apply any minification
//               // steps that turns valid ecma 5 code into
//               // invalid ecma 5 code. This is why the
//               // "compress" and "output"
//               ecma: 8
//             },
//             compress: {
//               ecma: 5,
//               warnings: false,
//               inline: 2
//             },
//             mangle: {
//               // find work around for Safari 10+
//               safari10: true
//             },
//             output: {
//               ecma: 5,
//               comments: false,
//               /* eslint-disable */
//               ascii_only: true
//               /* eslint-enable */
//             }
//           }
//         })
//       ]
//     }
