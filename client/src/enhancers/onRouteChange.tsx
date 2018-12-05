import { compose, lifecycle, mapProps } from 'recompose';
import { withRouter, RouteComponentProps } from 'react-router';
import { Location } from 'history';

type RouteChangeHandler = (location?: Location<any>) => any;

export const onRouteChange = (handleRouteChange: RouteChangeHandler) => BaseComponent => {
  const enhance = compose(
    mapProps(props => ({ ownProps: Object.assign({}, props) })),
    withRouter,
    lifecycle<RouteComponentProps, {}>({
      componentDidMount(): void {
        handleRouteChange(this.props.location);
      },
      componentDidUpdate(prevProps): void {
        if (this.props.location.pathname !== prevProps.location.pathname) {
          handleRouteChange(this.props.location);
        }
      }
    }),
    mapProps((props: any) => Object.assign({}, props.ownProps)),
  );

  return enhance(BaseComponent);
};
