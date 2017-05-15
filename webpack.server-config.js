var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './src/server/server.ts',
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'tzatziki.js'
  },
  resolve: {
    extensions: [".ts", ".js"],
    modules: ["src/server", "node_modules"]
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      { test: /library.*.json$/, loader: "file-loader?name=[path][name].[ext]" }
    ]
  },
  externals: { natives: 'commonjs natives' },
  // devtool: 'sourcemap'
  node: {
    __dirname: true,
    __filename: true
  }
}
