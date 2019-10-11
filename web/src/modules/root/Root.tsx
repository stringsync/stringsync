import React from 'react';
import { ConfigProvider } from 'antd';
import { Provider as StoreProvider } from 'react-redux';
import enUS from 'antd/lib/locale-provider/en_US';
import { Store } from '../../store';
import { ThemeProvider } from 'styled-components';
import theme from '../../theme.json';
import { PartialUser } from 'common/types';

const user: PartialUser = {
  id: 123,
};
console.log(user);

interface Props {
  store: Store;
}

const Root: React.FC<Props> = (props) => {
  return (
    <StoreProvider store={props.store}>
      <ConfigProvider locale={enUS}>
        <ThemeProvider theme={theme}>
          <>{props.children}</>
        </ThemeProvider>
      </ConfigProvider>
    </StoreProvider>
  );
};

export default Root;
