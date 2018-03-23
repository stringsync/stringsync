import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'data';
import { assertRender } from 'test';

assertRender(App, {}, { insideRouter: true });
