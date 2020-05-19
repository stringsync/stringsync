import React from 'react';
import { StoreViewportSync } from '../../components/StoreViewportSync';
// import { AuthenticateOnce } from '../../components/AuthenticateOnce';
import { Routes } from '../../routes/Routes';

const App: React.FC = () => {
  return (
    <>
      <StoreViewportSync />
      {/*<AuthenticateOnce />*/}
      <Routes />
    </>
  );
};

export default App;
