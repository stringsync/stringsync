import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { compose, lifecycle, withHandlers } from 'recompose';

const scrollToTop = () => window.scrollTo(0, 0);

const enhance = compose(
  withRouter,
  lifecycle<RouteComponentProps, {}>({
    componentDidMount(): void {
      this.props.history.listen(scrollToTop);
    }
  })
);

export const App = enhance(() => (
  <main>
    app
  </main>
));
