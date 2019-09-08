const fs = require('fs');
const { getLoader, loaderByName } = require('@craco/craco');
const styleLoader = require.resolve('style-loader');
const cssLoader = require.resolve('css-loader');
const lessLoader = require.resolve('less-loader');

const LESS_EXTENSION = /\.less$/;

const excludeFileLoaderLessHandling = (config) => {
  const { isFound, match } = getLoader(config, loaderByName('file-loader'));
  if (isFound) {
    match.loader &&
      match.loader.exclude &&
      match.loader.exclude.push(LESS_EXTENSION);
  }
  return config;
};

const getLessRules = (theme) => {
  return {
    oneOf: [
      {
        test: LESS_EXTENSION,
        use: [
          { loader: styleLoader },
          { loader: cssLoader },
          {
            loader: lessLoader,
            options: {
              modifyVars: theme,
              javascriptEnabled: true,
            },
          },
        ],
      },
    ],
  };
};

const appendLessRules = (lessRules, config) => {
  const oneOfRule = config.module.rules.find(
    (rule) => typeof rule.oneOf !== 'undefined'
  );
  const appendTo = oneOfRule ? oneOfRule.oneOf : config.module.rules;
  appendTo.push(lessRules);
  return config;
};

module.exports = {
  babel: {
    plugins: [
      [
        'import',
        { libraryName: 'antd', libraryDirectory: 'es', style: true },
        'ant',
      ],
    ],
  },
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          let nextWebpackConfig = excludeFileLoaderLessHandling(webpackConfig);
          const theme = JSON.parse(fs.readFileSync('./theme.json'));
          const lessRules = getLessRules(theme);
          nextWebpackConfig = appendLessRules(lessRules, nextWebpackConfig);
          return nextWebpackConfig;
        },
      },
    },
  ],
};
