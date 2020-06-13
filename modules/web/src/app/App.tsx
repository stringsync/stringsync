import React from 'react';
import { Routes } from './routes';

export const App: React.FC = () => {
  return (
    <div data-testid="app">
      <Routes />
    </div>
  );
};
