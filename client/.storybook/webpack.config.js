const TSDocgenPlugin = require('react-docgen-typescript-webpack-plugin');
const theme = require('../theme');
const injectAntdTheme = require('../plugins/injectAntdTheme');

module.exports = (baseConfig, env, defaultConfig) => {
  defaultConfig.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('awesome-typescript-loader'),
    options: {
      configFileName: 'tsconfig.storybook.json'
    }
  });
  defaultConfig.plugins.push(new TSDocgenPlugin());
  defaultConfig.resolve.extensions.push('.ts', '.tsx');

  return injectAntdTheme(theme, defaultConfig);
};
