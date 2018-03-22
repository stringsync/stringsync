import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';
import { store } from 'data';
import { assertRender } from 'test';

assertRender(Root, { store });
