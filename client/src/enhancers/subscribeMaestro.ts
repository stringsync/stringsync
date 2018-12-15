import { withMaestro, IWithMaestroProps } from './withMaestro';
import { IMaestroListener } from '../models/maestro';
import { compose, lifecycle, mapProps } from 'recompose';

type Listener<TProps> = (props: TProps) => IMaestroListener;

interface IOwnProps<TProps> {
  ownProps: TProps;
  listener: IMaestroListener;
}

type InsideProps<TProps> = IWithMaestroProps & IOwnProps<TProps>;

export const subscribeMaestro = <TProps>(listener: Listener<TProps>) => (BaseComponent: React.ComponentClass<any>) => {
  const enhance = compose(
    mapProps<IOwnProps<TProps>, TProps>(ownProps => ({ ownProps, listener: listener(ownProps) })),
    withMaestro,
    lifecycle<InsideProps<TProps>, {}, {}>({
      componentDidMount(): void {
        const { maestro } = this.props;

        if (maestro) {
          maestro.addListener(this.props.listener);
        }
      },
      componentDidUpdate(): void {
        const { maestro } = this.props;

        if (maestro && !maestro.hasListener(this.props.listener.name)) {
          maestro.addListener(this.props.listener);
        }
      },
      componentWillUnmount(): void {
        const { maestro } = this.props;

        if (maestro) {
          maestro.removeListener(this.props.listener.name);
        }
      }
    }),
    mapProps<TProps, InsideProps<TProps>>((props: any) => props.ownProps),
  );

  return enhance(BaseComponent);
};
