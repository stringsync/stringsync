import { compose, withState, mapProps, withHandlers, lifecycle } from 'recompose';

interface IOwnProps<TProps> {
  ownProps: TProps;
}

interface IHandleProps<TProps> extends IOwnProps<TProps> {
  handle: number | null;
  setHandle: (handler: number | null) => void;
}

interface IDoCallbackProps<TProps> extends IHandleProps<TProps> {
  doCallback: () => void;
}

interface IDoLoopProps<TProps> extends IDoCallbackProps<TProps> {
  doLoop: () => Promise<void>;
}

const RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

export const loop = <TProps>(callback: (props: TProps) => any) => (
  (BaseComponent: React.ComponentClass<TProps>) => {
    const enhance = compose<TProps, TProps>(
      mapProps((ownProps: TProps) => ({ ownProps })),
      withState('handle', 'setHandle', null),
      withHandlers({
        doCallback: (props: IHandleProps<TProps>) => () => {
          callback(props.ownProps);
        }
      }),
      withHandlers(() => {
        const doLoop = (props: IDoCallbackProps<TProps>) => async () => {
          props.doCallback();
          const handle = await RAF(doLoop(props));
          props.setHandle(handle);
        }

        return { doLoop }
      }),
      lifecycle<IDoLoopProps<TProps>, {}>({
        componentDidMount() {
          this.props.doLoop();
        },
        componentWillUnmount() {
          if (typeof this.props.handle === 'number') {
            window.cancelAnimationFrame(this.props.handle);
          }
        }
      }),
      mapProps((props: IDoLoopProps<TProps>) => Object.assign({}, props.ownProps))
    );

    return enhance(BaseComponent);
  }
)