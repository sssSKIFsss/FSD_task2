const path = require("path");
const s = require("../webpack.settings");

module.exports = function () {
  return {
    module: {
      rules: [{
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        include: path.resolve(s.dir, s.src, s.srcFonts),
        use: [{
          // loader: "file-loader",
          type: "asset/resource",
          options: {
            name: "[name].[ext]?[contenthash]",
            outputPath: s.distFonts,
            useRelativePath: true
          }
        }]
      }]
    }
  };
};
