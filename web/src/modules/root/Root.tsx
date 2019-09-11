import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Provider as StoreProvider } from 'react-redux';
import enUS from 'antd/lib/locale-provider/en_US';
import { Store } from '../../store';

interface Props {
  store: Store;
}

const Root: React.FC<Props> = (props) => {
  return (
    <StoreProvider store={props.store}>
      <ConfigProvider locale={enUS}>
        <BrowserRouter>{props.children}</BrowserRouter>
      </ConfigProvider>
    </StoreProvider>
  );
};

export default Root;
