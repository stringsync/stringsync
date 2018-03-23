import React from 'react';
import ReactDOM from 'react-dom';
import Nav from './Nav';
import { assertRender } from 'test';

assertRender(Nav, {}, { insideRouter: true });
