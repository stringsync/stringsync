import React from 'react';
import StoreViewportSync from '../../components/store-viewport-sync/StoreViewportSync';
import Routes from '../routes/Routes';

interface Props {}

const App: React.FC<Props> = (props) => {
  return (
    <>
      {/* NOT RENDERED TO DOM */}
      <StoreViewportSync />

      {/* RENDERED TO DOM */}
      <Routes />
    </>
  );
};

export default App;
