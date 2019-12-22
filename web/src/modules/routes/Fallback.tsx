import React from 'react';
import { Spinner } from '../../components/spinner';
import styled from 'styled-components';

const StyledDiv = styled.div`
  margin-top: 7rem;
  display: flex;
  justify-content: center;
`;

interface Props {}

const Fallback: React.FC<Props> = (props) => {
  return (
    <StyledDiv>
      <Spinner />
    </StyledDiv>
  );
};

export default Fallback;
