import { compose, withProps, lifecycle } from 'recompose';
import { RafLoop, RafSpec } from 'services';

export type RafLoopGetter = (props: any) => RafLoop | void;

export type  RafSpecFactory = (props: any) => RafSpec;

export interface IWithRafProps {
  rafLoop: RafLoop;
  rafSpec: RafSpec;
  registerRaf: () => void;
  unregisterRaf: () => void;
}

/**
 * This enhancer bridges the functionality of the rafLoop into React components.
 * The wrapped component will have access to registerRaf() and unregisterRaf() in
 * its props.
 * 
 * @param {ownProps => RafLoop} getRafLoop 
 * @param {ownProps => RafSpec} rafSpecFactory 
 */
export const withRaf = (getRafLoop: RafLoopGetter, rafSpecFactory: RafSpecFactory) => (
  (BaseComponent: React.ComponentClass<any> | React.SFC<any>) => {
    const enhance = compose<IWithRafProps, any>(
      withProps(props => {
        const rafLoop = getRafLoop(props);
        
        if (!(rafLoop instanceof RafLoop)) {
          throw new Error('Expected an instance of RafLoop');
        }
        
        return {
          rafLoop: getRafLoop(props),
          rafSpec: rafSpecFactory(props)
        }
      }),
      withProps((props: any) => {
        const { rafLoop, rafSpec } = props;

        if (!rafLoop) {
          throw new Error('getRafLoop must return a rafLoop instance')
        }

        return {
          registerRaf: () => {
            rafLoop.add(rafSpec);
          },
          unregisterRaf: () => {
            rafLoop.remove(rafSpec.name);
          }
        }
      }),
      lifecycle<any, any>({
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
