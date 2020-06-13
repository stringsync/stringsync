const { override, fixBabelImports, addLessLoader, babelInclude } = require('customize-cra');
const { theme } = require('./src/theme');
const { readdirSync } = require('fs');
const path = require('path');

const getModuleDirs = () => {
  const dir = path.resolve(__dirname, '..');
  return readdirSync(dir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => path.resolve(__dirname, '..', dirent.name, 'src'));
};

module.exports = override(
  babelInclude(getModuleDirs()),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: theme,
    },
  })
);
