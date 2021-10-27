import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { withRenderDelay } from '../../hocs/withRenderDelay';
import { compose } from '../../util/compose';
import { Duration } from '../../util/Duration';

const RENDER_DELAY = Duration.sec(1);

const Outer = styled.div`
  margin-top: 7em;
  text-align: center;
`;

const Icon = styled(LoadingOutlined)`
  font-size: 5em;
`;

const enhance = compose(withRenderDelay(RENDER_DELAY));

export const Fallback: React.FC = enhance(() => {
  return (
    <Outer data-testid="fallback">
      <Spin indicator={<Icon type="loading" />} />
    </Outer>
  );
});
