const path = require('path');
const WebpackNodeExternals = require('webpack-node-externals');
const WebpackShellPlugin = require('webpack-shell-plugin');

const env = process.env.NODE_ENV || 'development';

module.exports = {
  entry: './src/index.ts',
  mode: env,
  watch: env === 'development',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dst'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
      },
    ],
  },
  externals: [WebpackNodeExternals()],
  plugins: [
    new WebpackShellPlugin({
      onBuildEnd: ['yarn start:dev'],
    }),
  ],
};
