import React from 'react';
import { Box } from '../../components/Box';
import styled from 'styled-components';

const Outer = styled.div`
  margin: 0 auto;
  max-width: 320px;
`;

const Inner = styled.div`
  margin-top: 24px;
`;

const Signup: React.FC = () => {
  return (
    <Outer data-testid="signup">
      <Inner>
        <Box />
      </Inner>
    </Outer>
  );
};

export default Signup;
