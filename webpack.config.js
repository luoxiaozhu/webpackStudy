/*
 * @Author: Duke
 * @Date: 2021-08-12 15:56:47
 * @LastEditors: Duke
 * @LastEditTime: 2021-08-13 14:42:05
 * @Description: webpack 配置项
 */

const path = require('path');

const fs = require('fs');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const copyFile = [];
// 代码注入相关
fs.readdir(`${__dirname}/example/index_bak`, (err, files) => {
  if (Array.isArray(files)) {
    files.forEach((name) => {
      copyFile.push({
        from: `example/index_bak/${name}`,
        to: `注入/${name}`,
      });
    });
  }
});

module.exports = {
  mode: 'production', // "production" | "development" | "none"
  // Chosen mode tells webpack to use its built-in optimizations accordingly.
  entry: {
    // 需要打包的文件
    libs: './editorgl/libs/index.js',
    glInstance: './editorgl/index.js',
    treeData: './example/data/index.js',
  },
  // 默认为 ./src
  // 这里应用程序开始执行
  // webpack 开始打包
  output: {
    filename: '[name].min.js',
    chunkFilename: '[name].min.js',
    path: path.resolve(__dirname, 'Build'),
    publicPath: './',
  },
  module: {
    // 模块配置相关
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            {
              plugins: ['@babel/plugin-proposal-class-properties'],
            },
          ],
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // replace ExtractTextPlugin.extract({..})
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'images/[hash:8].[name].[ext]',
          },
        },
      },
      {
        test: /\.(csv|tsv)$/,
        use: ['csv-loader'],
      },
      {
        test: /\.xml$/,
        use: ['xml-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new HTMLWebpackPlugin(),
    new HTMLWebpackPlugin({
      title: 'THREE',
      inject: true,
      // minify: false,
      // chunks: chunks,//页面要引入的包
      // filename: 'index.html', // 文件名
      template: './example/example.html', // 模板地址
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CopyPlugin(copyFile),
  ],
};
