import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Root } from 'root';
import { store } from 'data';

interface AssertRenderOptions {
  isRoot: boolean;
}

type TComponent = typeof React.Component | React.SFC | React.ComponentClass;

const DEFAULT_OPTIONS: AssertRenderOptions = Object.freeze({
  isRoot: false
});

/**
 * Applies the opts param to the Component
 * 
 * @param {React.Component} Component 
 * @param {object} opts
 * @return {React.Component}
 */
const getTestComponent = (Component: TComponent, props: object, options: AssertRenderOptions): TComponent => {
  let TestComponent: TComponent;
  if (options.isRoot) {
    TestComponent = () => <Component {...props} />;
  } else {
    TestComponent = () => (
      <Root store={store}>
        <Component {...props} />
      </Root>
    );
  }

  return TestComponent;
};

/**
 * Asserts that the Component renders successfully with the props param
 * options can be specified to modify the component that gets tested
 * 
 * @param {React.Component} Component 
 * @param {object} props 
 * @param {object} opts 
 */
const assertRender = (Component: TComponent, props: object = {}, options: AssertRenderOptions = DEFAULT_OPTIONS) => {
  it('renders', () => {
    expect(Component).toBeDefined();

    const div = document.createElement('div') as HTMLDivElement;
    const TestComponent = getTestComponent(Component, props, options);

    ReactDOM.render(<TestComponent {...props} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
};

export default assertRender;
