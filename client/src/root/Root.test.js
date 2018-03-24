import React from 'react';
import Root from './Root';
import { store } from 'data';
import { assertRender } from 'test';

assertRender(Root, { store }, { isRoot: true });
