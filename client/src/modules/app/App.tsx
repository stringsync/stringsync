import * as React from 'react';
import { compose } from 'recompose';
import { Layout } from 'antd';
import { Gradient } from './Gradient';
import { Behavior } from './behavior/Behavior';
import { Header } from './header/Header';
import { Content } from './content/Content';
import { Footer } from './footer/Footer';
import { onRouteChange } from '../../enhancers/onRouteChange';

const scrollToTop = () => setTimeout(() => window.scrollTo(0, 0), 0);

const enhance = compose(
  onRouteChange(scrollToTop),
);

export const App = enhance(() => (
  <main>
    <Behavior />
    <Layout>
      <Header />
      <Content />
      <Footer />
    </Layout>
  </main>
));
