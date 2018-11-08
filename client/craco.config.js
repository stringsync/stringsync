const injectAntdTheme = require('./plugins/injectAntdTheme');
const theme = require('./src/theme');

module.exports = {
  babel: {
    plugins: [
      [
        'import',
        {
          'libraryName': 'antd',
          'libraryDirectory':
          'es',
          'style': true
        },
        'ant'
      ]
    ],
  },
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => injectAntdTheme(theme, webpackConfig)
      }
    }
  ]
};
