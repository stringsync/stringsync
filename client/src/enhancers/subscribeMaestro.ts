import { withMaestro, IWithMaestroProps } from './withMaestro';
import { IMaestroListener } from '../models/maestro';
import { compose, lifecycle, mapProps } from 'recompose';

export const subscribeMaestro = (listener: IMaestroListener) => (BaseComponent: React.ComponentClass<any>) => {
  const enhance = compose(
    mapProps(ownProps => ({ ownProps })),
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
    }),
    mapProps((props: any) => props.ownProps),
  );

  return enhance(BaseComponent);
};
