const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

const config = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
  },
  optimization: {
    runtimeChunk: { name: "webpack" },
    moduleIds: "hashed",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
    new CopyPlugin({
      patterns: [{ context: "src", from: "*.css" }, { context: "src", from: "*.json" }],
    }),
    new CleanWebpackPlugin("dist"),
    new WorkboxPlugin.InjectManifest({
      swSrc: `/src/sw.js`,
      swDest: "sw.js",
    }),
  ],
};

module.exports = config;
