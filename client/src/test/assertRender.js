import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { getDisplayName } from 'recompose';

/**
 * Default options used for assertRender
 * 
 * @return {object}
 */
const DEFAULT_OPTS = Object.freeze({
  insideRouter: false
});

/**
 * Generates a test name for assertRender
 * 
 * @param {React.Component} Component 
 * @param {React.Props} props
 * @return {string}
 */
const testName = (Component, props) => {
  let componentName = getDisplayName(Component);
  componentName = componentName === 'Component' ? Component.name : componentName;

  const propKeys = Object.keys(props).map(key => `'${key}'`);
  
  if (propKeys.length > 0) {
    return `renders ${componentName} with ${propKeys.join(', ')} without crashing`
  } else {
    return `renders ${componentName} without crashing`
  }
};

/**
 * Applies the opts param to the Component
 * 
 * @param {React.Component} Component 
 * @param {object} opts
 * @return {React.Component}
 */
const getTestComponent = (Component, opts) => {
  let testComponent = Component;

  if (opts.insideRouter) {
    testComponent = props => (
      <BrowserRouter>
        <Component {...props} />
      </BrowserRouter>
    );
  }

  return testComponent;
};

/**
 * Asserts that the Component renders successfully with the props param
 * options can be specified to modify the component that gets tested
 * 
 * @param {React.Component} Component 
 * @param {object} props 
 * @param {object} opts 
 */
const assertRender = (Component, props = {}, opts = DEFAULT_OPTS) => {
  it (testName(Component, props), () => {
    const div = document.createElement('div');
    const TestComponent = getTestComponent(Component, opts);
    ReactDOM.render(<TestComponent {...props} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
}

export default assertRender;
