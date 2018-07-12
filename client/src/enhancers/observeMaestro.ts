import { lifecycle, compose, withState } from 'recompose';

export interface IObserveMaestroProps {
  observer: IObserver;
  setObserver: (observer: IObserver) => void;
}

/**
 * Given an observer, subscribes and unsubscribes from maestro.
 * 
 * @param observer 
 */
export const observeMaestro = <P>(getObserver: (props: P) => IObserver) => (
  (BaseComponent: React.ComponentClass<P> | React.SFC<P>) => {
    const enhance = compose(
      withState('observer', 'setObserver', null),
      lifecycle<IObserveMaestroProps & P, any>({
        componentWillMount(): void {
          if (!window.ss.maestro) {
            throw new Error(
              'Expected maestro instance under the window.ss namespace. Mount a MaestroController.'
            )
          } else if (this.props.observer) {
            throw new Error('expected no observer to be set');
          }

          const observer = getObserver(this.props);
          window.ss.maestro.subscribe(observer);
          this.props.setObserver(observer);
        },
        componentWillUnmount(): void {
          if (!window.ss.maestro) {
            return;
          }
          
          window.ss.maestro.unsubscribe(this.props.observer);
        }
      })
    );

    return enhance(BaseComponent);
  }
);
