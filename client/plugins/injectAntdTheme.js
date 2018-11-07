const { getLoader, loaderByName } = require("craco");

const LESS_EXTENSION = /\.less$/;

const excludeFileLoaderLessHandling = config => {
  const { isFound, match } = getLoader(config, loaderByName('file-loader'));
  if (isFound) {
    match.loader.exclude.push(LESS_EXTENSION);
  }

  return config;
}

const getLessRules = theme => {
  return {
    oneOf: [{
      test: lessExtension,
      use: [
        {
          loader: require.resolve('style-loader')
        }, {
          loader: require.resolve('css-loader')
        }, {
          loader: require.resolve('less-loader'),
          options: {
            modifyVars: theme,
            javascriptEnabled: true
          }
        }
      ]
    }]
  }
}

const appendLessRules = (lessRules, config) => {
  const oneOfRule = config.module.rules.find(rule => typeof rule.oneOf !== 'undefined');
  const appendTo = oneOfRule ? oneOfRule.oneOf : webpackConfig.module.rules;
  appendTo.push(lessRules);

  return config;
};

const injectAntdTheme = (theme, config) => {
  let nextConfig
  nextConfig = excludeFileLoaderLessHandling(config);
  nextConfig = appendLessRules(getLessRules(theme));
  return nextConfig;
};

export default injectAntdTheme;
