import React from 'react';
import { storiesOf } from '@storybook/react';
import { number } from '@storybook/addon-knobs/react';
import { Logo } from './Logo';
import { Name } from './Name';
import { wInfo } from '../../../.storybook/utils';

const story = storiesOf('Branding');

story.addWithJSX('Logo', wInfo(`
  The logo is used in various places throughout the code base.

  ### Overview

  ### Usage
  ~~~js
    <Logo size={64} />
  ~~~
`)(() => <Logo size={number('size', 64)} />));
story.addWithJSX('Name', () => <Name />);
