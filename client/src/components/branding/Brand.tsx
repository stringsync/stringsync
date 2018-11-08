import * as React from 'react';
import { Divider } from 'antd';
import { Logo } from './Logo';
import { Name } from './Name';

export const Brand = () => (
  <span>
    <Logo width={24} height={24} />
    <Divider type="vertical" />
    <Name />
  </span>
);
