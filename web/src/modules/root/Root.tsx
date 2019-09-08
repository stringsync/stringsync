import React from 'react';
import createStore from '../../store/createStore';
import enUS from 'antd/lib/locale-provider/en_US';
import { LocaleProvider } from 'antd';
import { Provider as StoreProvider } from 'react-redux';
import App from '../app/App';
import { BrowserRouter } from 'react-router-dom';

interface Props {
  store: ReturnType<typeof createStore>;
}

const Root: React.FC<Props> = (props) => {
  return (
    <StoreProvider store={props.store}>
      <LocaleProvider locale={enUS}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LocaleProvider>
    </StoreProvider>
  );
};

export default Root;
