import { compose, withProps, lifecycle } from 'recompose';

/**
 * This enhancer bridges the functionality of the rafLoop into React components.
 * The wrapped component will have access to registerRaf() and unregisterRaf() in
 * its props.
 * 
 * @param {props => RafLoop} getRafLoop 
 * @param {props => RafSpec} rafSpecFactory 
 */
const withRaf = (getRafLoop, rafSpecFactory) => (
  BaseComponent => {
    const enhance = compose(
      withProps(props => ({
        rafLoop: getRafLoop(props),
        rafSpec: rafSpecFactory(props)
      })),
      withProps(props => ({
        registerRaf: () => {
          props.rafLoop.add(rafSpec);
        },
        unregisterRaf: () => {
          props.rafLoop.remove(rafSpec.name);
        }
      })),
      lifecycle({
        componentDidMount() {
          this.props.registerRaf();
        },
        componentWillUnmount() {
          this.props.unregisterRaf();
        }
      })
    );

    return enhance(BaseComponent);
  }
);

export default withRaf;
