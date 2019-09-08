import React from 'react';
import { Layout } from 'antd';
import Routes from '../routes/Routes';

interface Props {}

const App: React.FC<Props> = (props) => {
  return (
    <main>
      <Layout>
        <Layout.Header>Header</Layout.Header>
        <Layout.Content>
          <Routes />
        </Layout.Content>
        <Layout.Footer>Footer</Layout.Footer>
      </Layout>
    </main>
  );
};

export default App;
