import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Provider as StoreProvider } from 'react-redux';
import App from '../app/App';
import enUS from 'antd/lib/locale-provider/en_US';
import ScreenSync from '../../components/ScreenSync';
import { Store } from '../../store';

interface Props {
  store: Store;
}

const Root: React.FC<Props> = (props) => {
  return (
    <StoreProvider store={props.store}>
      <ConfigProvider locale={enUS}>
        <BrowserRouter>
          <ScreenSync></ScreenSync>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </StoreProvider>
  );
};

export default Root;
