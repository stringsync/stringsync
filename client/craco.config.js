const injectAntdTheme = require('./plugins/injectAntdTheme');
const theme = require('./src/theme');

module.exports = {
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => injectAntdTheme(theme, webpackConfig)
      }
    }
  ]
};
