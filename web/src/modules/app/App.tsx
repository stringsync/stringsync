import React from 'react';
import StoreViewportSync from '../../components/store-viewport-sync/StoreViewportSync';
import Routes from '../routes/Routes';
import RefreshAuth from '../../components/refresh-auth/RefreshAuth';

interface Props {}

const App: React.FC<Props> = (props) => {
  return (
    <>
      {/* NOT RENDERED TO DOM */}
      <StoreViewportSync />
      <RefreshAuth />

      {/* RENDERED TO DOM */}
      <Routes />
    </>
  );
};

export default App;
