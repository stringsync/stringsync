import * as React from 'react';
import { compose } from 'recompose';
import { IMaestroListener } from '../../models/maestro';
import scroller from 'react-scroll';

const listener: IMaestroListener = {
  name: 'scrollerListener',
  callback: () => null
};

const enhance = compose(

);

export const Scroller = enhance(() => null);
