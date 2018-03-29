import * as React from 'react';
import * as ReactDOM from 'react-dom';

const assertRender = (Component: React.Component, props: object = {}) => {
  it('renders', () => {
    expect(Component).toBeDefined();
    const div = document.createElement('div');
    ReactDOM.render(<Component {...props} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
};

export default assertRender;
