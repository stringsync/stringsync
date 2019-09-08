import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Provider as StoreProvider } from 'react-redux';
import App from '../app/App';
import createStore from '../../store/createStore';
import enUS from 'antd/lib/locale-provider/en_US';

interface Props {
  store: ReturnType<typeof createStore>;
}

const Root: React.FC<Props> = (props) => {
  return (
    <StoreProvider store={props.store}>
      <ConfigProvider locale={enUS}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </StoreProvider>
  );
};

export default Root;
