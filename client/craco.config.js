// https://github.com/timarney/react-app-rewired/blob/master/packages/react-app-rewire-less/index.js
const path = require('path');

const loaderNameMatches = function(rule, loaderName) {
  return rule && rule.loader && typeof rule.loader === 'string' &&
    (rule.loader.indexOf(`${path.sep}${loaderName}${path.sep}`) !== -1 ||
    rule.loader.indexOf(`@${loaderName}${path.sep}`) !== -1);
};

const getLoader = function(rules, matcher) {
  let loader;

  // Array.prototype.some is used to return early if a matcher is found
  rules.some(rule => {
    return (loader = matcher(rule)
      ? rule
      : getLoader(rule.use || rule.oneOf || (Array.isArray(rule.loader) && rule.loader) || [], matcher));
  });

  return loader;
};

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
      ], [
        'emotion',
        {
          // sourceMap is on by default but source maps are dead code eliminated in production
          'sourceMap': true,
          'autoLabel': process.env.NODE_ENV !== 'production',
          'labelFormat': '[local]',
          'cssPropOptimization': true
        }
      ]
    ],
  },
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          const lessExtension = /\.less$/;

          const fileLoader = getLoader(
            webpackConfig.module.rules,
            rule => loaderNameMatches(rule, 'file-loader')
          );
          fileLoader.exclude.push(lessExtension);

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
        
          const oneOfRule = webpackConfig.module.rules.find(rule => (
            typeof rule.oneOf !== 'undefined'
          ));
          const appendTo = oneOfRule ? oneOfRule.oneOf : webpackConfig.module.rules;
          appendTo.push(lessRules);

          return webpackConfig;
        }
      }
    }
  ]
};
