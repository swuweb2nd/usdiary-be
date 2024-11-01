const nodeExternals = require("webpack-node-externals");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin"); // CopyWebpackPlugin 추가

module.exports = {
  mode: "production",
  entry: {
    bundle: path.resolve(__dirname, "app.js"),
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  target: "node",
  externalsPresets: {
    node: true,
  },
  externals: [nodeExternals()],
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'node_modules/swagger-ui-dist/swagger-ui.css', to: 'swagger-ui.css' },
        { from: 'node_modules/swagger-ui-dist/swagger-ui-bundle.js', to: 'swagger-ui-bundle.js' },
        { from: 'node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js', to: 'swagger-ui-standalone-preset.js' },
        { from: 'node_modules/swagger-ui-dist/favicon-16x16.png', to: 'favicon-16x16.png' },
        { from: 'node_modules/swagger-ui-dist/favicon-32x32.png', to: 'favicon-32x32.png' }
      ]
    })
  ]
};
