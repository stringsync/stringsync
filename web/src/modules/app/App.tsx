import React from 'react';
import { StoreViewportSync } from '../../components/store-viewport-sync';
import { ReauthOnce } from '../../components/reauth-once';
import { Routes } from '../routes/Routes';

interface Props {}

const App: React.FC<Props> = (props) => {
  return (
    <>
      <StoreViewportSync />
      <ReauthOnce />
      <Routes />
    </>
  );
};

export default App;
