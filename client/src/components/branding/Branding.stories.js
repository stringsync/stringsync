import React from 'react';
import { storiesOf } from '@storybook/react';
import { number } from '@storybook/addon-knobs/react';
import { Logo } from './Logo';
import { Name } from './Name';
import { wInfo } from '../../../.storybook/utils';

const story = storiesOf('Branding');

story.addWithJSX('Logo', wInfo(`
  The logo is used in various places throughout the code base. It will only scale as
  as square according to it's larger width or height dimension.

  ### Overview

  ### Usage
  ~~~js
    <Logo width={640} height={640)} />
  ~~~
`)(() => <Logo width={number('width', 64)} height={number('height', 64)} />));
story.addWithJSX('Name', () => <Name />);
