import React from 'react';
import { Icon, Spin } from 'antd';
import { useStyled } from '../../hooks/useStyled';

export const Fallback: React.FC = () => {
  const StyledDiv = useStyled(
    (styled) => styled.div`
      margin-top: 7rem;
      display: flex;
      justify-content: center;
    `
  );

  const StyledIcon = useStyled(
    (styled) => styled(Icon)`
      font-size: 5em;
    `
  );

  return (
    <StyledDiv>
      <Spin indicator={<StyledIcon spin type="loading" />} />
    </StyledDiv>
  );
};
