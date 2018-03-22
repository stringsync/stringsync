import React from 'react';
import ReactDOM from 'react-dom';
import { getDisplayName } from 'recompose';

const testMessage = (Component, props) => {
  let componentName = getDisplayName(Component);
  componentName = componentName === 'Component' ? Component.name : componentName;

  const propKeys = Object.keys(props).map(key => `'${key}'`);
  
  if (propKeys.length > 0) {
    return `renders ${componentName} with ${propKeys.join(', ')} without crashing`
  } else {
    return `renders ${componentName} without crashing`
  }
};

const assertRender = (Component, props = {}) => {
  it (testMessage(Component, props), () => {
    const div = document.createElement('div');
    ReactDOM.render(<Component {...props} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
}

export default assertRender;
