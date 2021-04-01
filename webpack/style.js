
"use strict";

const merge = require("webpack-merge");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const s = require("../webpack.settings");

const postcssLoader = (isDev) => {
  return {
    loader: "postcss-loader",
    options: {
      ident: "postcss",
      sourceMap: isDev,
      plugins: () => [
        require("doiuse")({
          ignore: "rem",
          ignoreFiles: ["**/font/**/*.css", "**/tmp/**/*.css", "**/temp/**/*.css"]
        }),
        require("autoprefixer")({
          grid: true,
          sourceMap: isDev
        })
        // require("postcss-url")(),
        // require("postcss-import")(),
        // require("postcss-nested")(),
        // require("stylelint")(),
        // "postcss-import": "^12.0.1",
        // "postcss-load-config": "^2.1.0",
        // "postcss-nested": "^4.2.1",
        // "postcss-preset-env": "^6.7.0",
        // "postcss-reporter": "^6.0.1",
      ]
    }
  };
};

const scssLoader = (isDev) => {
  return {
    loader: "sass-loader",
    options: { sourceMap: isDev }
  };
};

const cssLoaders = (isDev, extraLoader) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true,
        sourceMap: isDev
      }
    }, {
      loader: "css-loader",
      options: {
        modules: true,
        // если убрать resolve-url-loader
        // то
        //importLoaders: extraLoader ? 2 : 1,
        importLoaders: extraLoader ? 3 : 2,
        sourceMap: isDev
      }
    }, {
      // у многих этот лоадер отсутствует
      loader: "resolve-url-loader",
      options: {
        sourceMap: isDev
      }
    }
  ];

  loaders.push(postcssLoader(isDev));
  if (extraLoader) {
    loaders.push(extraLoader(isDev));
  }

  return loaders;
};

module.exports = isDev => {
  return merge(
    {
      module: {
        rules: [
          {
            test: /\.css$/,
            include: [
              path.resolve(s.dir, s.src, s.srcStyles),
              path.resolve(s.dir, s.src, s.srcComponents)
            ],
            use: cssLoaders(isDev)
          }, {
            test: /\.s[ac]ss$/,
            include: [
              path.resolve(s.dir, s.src, s.srcStyles),
              path.resolve(s.dir, s.src, s.srcComponents)
            ],
            use: cssLoaders(isDev, scssLoader)
          }
        ]
      }
    },
    isDev ? {} : {
      optimization: {
        minimize: true,
        minimizer: [
          new CssMinimizerPlugin(
            {
              parallel: true,
              sourceMap: false
            }
          )
        ]
      }
    }, {
      plugins: [
        new MiniCssExtractPlugin(
          {
            path: path.resolve(s.dir, s.dist),
            filename: s.distStyle + "/" + s.fileName(isDev) +
              "css",
            chunkFilename: s.distStyle + "/" +
              s.chunkFileName(isDev) + "css"
          }),
        new StylelintPlugin({
          context: "",
          configFile: ".stylelintrc.js"
        })
      ]
    }
  );
};
