import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, boolean } from '@storybook/addon-knobs/react';
import { wInfo } from '../../../.storybook/utils';
import { Example } from './Example';

storiesOf('Example', module).addWithJSX(
  'basic Button',
  wInfo(`
  ### Overview

  This component is purely an example for other components.

  ### Usage
  ~~~js
  <Button
    label={'Enroll'}
    disabled={false}
    onClick={() => alert('hello there')}
  />
  ~~~`
)(() => (
    <Example
      label={text('label', 'Enroll')}
      disabled={boolean('disabled', false)}
      onClick={() => alert('hello there')}
    >foo</Example>
  ))
);