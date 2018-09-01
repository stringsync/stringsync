import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Root } from 'modules/root';
import { createStore } from 'data';
import { xhrMock, localStorageMock } from './mocks';
import { configure } from 'config';

const assertRender = (
  Component: React.ComponentClass | React.SFC, props: object = {}): void => {
  it('renders without crashing', () => {
    window.XMLHttpRequest = jest.fn(xhrMock);
    (window as any).localStorage = localStorageMock;

    configure();
    const div = document.createElement('div');
    const TestComponent = () => (
      <Root store={createStore()}>
        <Component {...props} />
      </Root>
    );

    ReactDOM.render(<TestComponent />, div);
    ReactDOM.unmountComponentAtNode(div);
  })
};

export default assertRender;
