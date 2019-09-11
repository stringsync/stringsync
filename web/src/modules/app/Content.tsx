import React from 'react';
import Routes from '../routes/Routes';
import { Layout } from 'antd';

interface Props {}

const Content: React.FC<Props> = (props) => {
  return (
    <Layout.Content>
      <main>
        <Routes />
      </main>
    </Layout.Content>
  );
};

export default Content;
