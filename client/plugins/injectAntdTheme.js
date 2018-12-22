const { getLoader, loaderByName } = require('@craco/craco');

const LESS_EXTENSION = /\.less$/;

const excludeFileLoaderLessHandling = config => {
  const { isFound, match } = getLoader(config, loaderByName('file-loader'));
  if (isFound) {
    match.loader && match.loader.exclude && match.loader.exclude.push(LESS_EXTENSION);
  }

  return config;
}

const getLessRules = theme => {
  return {
    oneOf: [{
      test: LESS_EXTENSION,
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
  const appendTo = oneOfRule ? oneOfRule.oneOf : config.module.rules;
  appendTo.push(lessRules);

  return config;
};

const injectAntdTheme = (theme, config) => {
  let nextConfig = excludeFileLoaderLessHandling(config);
  nextConfig = appendLessRules(getLessRules(theme), nextConfig);
  return nextConfig;
};

module.exports = injectAntdTheme;
