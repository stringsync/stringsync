import React from 'react';
import { Box } from '../../components/Box';
import styled from 'styled-components';

const Outer = styled.div`
  margin: 0 auto;
  max-width: 320px;
`;

const StyledBox = styled(Box)`
  margin-top: 24px;
`;

const Signup: React.FC = () => {
  return (
    <Outer data-testid="signup">
      <StyledBox />
      <StyledBox />
    </Outer>
  );
};

export default Signup;
