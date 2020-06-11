import React, { useMemo } from 'react';
import { Spin } from 'antd';
import { styled } from '../../util';
import Icon from '@ant-design/icons';

export const Fallback: React.FC = () => {
  // FIXME: If these styled components are created outside of this
  // function, some of the antd styles break. This may be a bug in
  // antd.
  const StyledDiv = useMemo(
    () => styled.div`
      margin-top: 7rem;
      display: flex;
      justify-content: center;
    `,
    []
  );

  const StyledIcon = useMemo(
    () =>
      styled(Icon)`
        font-size: 5em;
      `,
    []
  );

  return (
    <StyledDiv>
      <Spin indicator={<StyledIcon spin type="loading" />} />
    </StyledDiv>
  );
};
