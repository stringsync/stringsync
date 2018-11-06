import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, boolean } from '@storybook/addon-knobs/react';
import { wInfo } from '../../../.storybook/utils';
import { Example } from './Example';

storiesOf('Examples', module).addWithJSX(
  'basic example',
  wInfo(`
  ### Overview

  This component is purely an example for other components.

  ### Usage
  ~~~js
  <Example
    label={'Enroll'}
    disabled={false}
  />
  ~~~`
)(() => (
    <Example
      label={text('label', 'Enroll')}
      disabled={boolean('disabled', false)}
    >foo</Example>
  ))
);