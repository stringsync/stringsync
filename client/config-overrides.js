const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {
  config = injectBabelPlugin(['import', { libraryName: 'antd', libraryDirectory: 'es', style: true}], config);
  config = rewireLess.withLoaderOptions({
    modifyVars: {
      "@primary-color": "#fc354c",
      "@brand-primary": "@primary-color",
      "@layout-body-background": "#f8f8f8",
      "@background-color-base": "#fcfcfc",
      "@brand-primary-tap": "lighten(@brand-primary, 10%)",
      "@outline-color": "#aaa",
      "@input-hover-border-color": "#ddd"
    }
  })(config, env);
  return config;
};
