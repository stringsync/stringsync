import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FormPage } from '../../components/FormPage';
import { Wordmark } from '../../components/Wordmark';

const Center = styled.div`
  text-align: center;
`;

const StyledH1 = styled.h1`
  text-align: center;
  font-size: 32px;
`;

const Signup: React.FC = () => {
  return (
    <div data-testid="signup">
      <FormPage
        main={
          <>
            <StyledH1>
              <Wordmark></Wordmark>
            </StyledH1>
          </>
        }
        footer={
          <Center>
            Have an account? <Link to="login">login</Link>
          </Center>
        }
      />
    </div>
  );
};

export default Signup;
