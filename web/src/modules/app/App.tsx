import React from 'react';
import { StoreViewportSync } from '../../components/StoreViewportSync';
import { AuthenticateOnce } from '../../components/AuthenticateOnce';
import { Routes } from '../routes/Routes';

interface Props {}

const App: React.FC<Props> = (props) => {
  return (
    <>
      <StoreViewportSync />
      <AuthenticateOnce />
      <Routes />
    </>
  );
};

export default App;
