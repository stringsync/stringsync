import { withMaestro, IWithMaestroProps } from './withMaestro';
import { IMaestroListener } from '../models/maestro';
import { compose, lifecycle } from 'recompose';

export const subscribeMaestro = (listener: IMaestroListener) => (BaseComponent: React.ComponentClass<any>) => {
  const enhance = compose(
    withMaestro,
    lifecycle<IWithMaestroProps, {}, {}>({
      componentDidMount(): void {
        const { maestro } = this.props;

        if (maestro) {
          maestro.addListener(listener);
        }
      },
      componentDidUpdate(): void {
        const { maestro } = this.props;

        if (maestro && !maestro.hasListener(listener.name)) {
          maestro.addListener(listener);
        }
      },
      componentWillUnmount(): void {
        const { maestro } = this.props;

        if (maestro) {
          maestro.removeListener(listener.name);
        }
      }
    })
  );

  return enhance(BaseComponent);
};
