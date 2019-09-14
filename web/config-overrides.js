const fs = require('fs');
const { override, fixBabelImports, addLessLoader } = require('customize-cra');

const theme = JSON.parse(fs.readFileSync('./src/theme.json'));

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: theme,
  })
);
