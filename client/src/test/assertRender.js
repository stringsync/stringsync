import React from 'react';
import ReactDOM from 'react-dom';

const assertRender = (Component, props = {}) => {
  it (`renders ${Component.name} without crashing`, () => {
    const div = document.createElement('div');
    ReactDOM.render(<Component {...props} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
}

export default assertRender;
