import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { compose, lifecycle } from 'recompose';
import { Layout } from 'antd';
import { Gradient } from './Gradient';
import { Header } from './Header';
import { Content } from './Content';
import { Footer } from './Footer';
import { Behavior } from './Behavior';

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
    <Behavior />
    <Gradient />
    <Layout>
      <Header />
      <Content />
      <Footer />
    </Layout>
  </main>
));
