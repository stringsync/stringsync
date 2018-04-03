import { assertRender } from 'test';
import { Root } from './';
import { store } from 'data';

assertRender(Root, { store }, { isRoot: true });
