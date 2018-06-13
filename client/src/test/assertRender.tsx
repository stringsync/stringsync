import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Root } from 'root';
import { createStore } from 'data';
import { xhrMock } from './mocks';
import { configure } from 'config';

const createTestComponent = (Component: React.ComponentClass | React.SFC, props: object): React.SFC => () => (
  <Root store={createStore()}>
    <Component {...props} />
  </Root>
);

const assertRender = (
  Component: React.ComponentClass | React.SFC, props: object = {}): void => {
  it('renders without crashing', () => {
    window.XMLHttpRequest = jest.fn(xhrMock);

    configure();
    const div = document.createElement('div');
    const TestComponent = createTestComponent(Component, props);

    ReactDOM.render(<TestComponent />, div);
    ReactDOM.unmountComponentAtNode(div);
  })
};

export default assertRender;
