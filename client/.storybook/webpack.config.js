const path = require('path');
const TSDocgenPlugin = require('react-docgen-typescript-webpack-plugin');

const loaderNameMatches = function (rule, loaderName) {
  return rule && rule.loader && typeof rule.loader === 'string' &&
    (rule.loader.indexOf(`${path.sep}${loaderName}${path.sep}`) !== -1 ||
      rule.loader.indexOf(`@${loaderName}${path.sep}`) !== -1);
};

const getLoader = function (rules, matcher) {
  let loader;

  // Array.prototype.some is used to return early if a matcher is found
  rules.some(rule => {
    return (loader = matcher(rule)
      ? rule
      : getLoader(rule.use || rule.oneOf || (Array.isArray(rule.loader) && rule.loader) || [], matcher));
  });

  return loader;
};

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

  const lessExtension = /\.less$/;

  const lessRules = {
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
            modifyVars: {
              '@primary-color': '#1DA57A',
              '@link-color': '#1DA57A',
              '@border-radius-base': '2px',
            },
            javascriptEnabled: true
          }
        }
      ]
    }]
  }

  const oneOfRule = defaultConfig.module.rules.find(rule => (
    typeof rule.oneOf !== 'undefined'
  ));
  const appendTo = oneOfRule ? oneOfRule.oneOf : defaultConfig.module.rules;
  appendTo.push(lessRules);

  return defaultConfig;
};
