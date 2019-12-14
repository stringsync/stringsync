import React from 'react';
import StoreViewportSync from '../../components/store-viewport-sync/StoreViewportSync';
import Routes from '../routes/Routes';
import ReauthOnce from '../../components/reauth-once/ReauthOnce';

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
