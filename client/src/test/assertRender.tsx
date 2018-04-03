import * as React from 'react';
import * as ReactDOM from 'react-dom';

type TComponent = typeof React.Component | React.SFC | React.ComponentClass;

const assertRender = (Component: TComponent, props: object = {}) => {
  it('renders', () => {
    expect(Component).toBeDefined();
    const div = document.createElement('div');
    ReactDOM.render(<Component {...props} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
};

export default assertRender;
