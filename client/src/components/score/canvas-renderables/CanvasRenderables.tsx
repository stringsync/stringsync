import * as React from 'react';
import { compose, branch, renderNothing } from 'recompose';
import { Scroller } from '../Scroller';
import { Caret } from './Caret';
import { LoopCaret } from './LoopCaret';
import { Note } from './Note';

interface IOuterProps {
  active: boolean;
}

const enhance = compose<IOuterProps, IOuterProps>(
  branch<IOuterProps>(props => !props.active, renderNothing)
);

export const CanvasRenderables = enhance(() => (
  <div>
    <Scroller />
    <Caret />
    <LoopCaret />
    <Note />
  </div>
));
