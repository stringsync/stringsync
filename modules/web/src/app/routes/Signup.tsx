import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FormPage } from '../../components/FormPage';

const Center = styled.div`
  text-align: center;
`;

const Signup: React.FC = () => {
  return (
    <div data-testid="signup">
      <FormPage
        wordmarked
        main={<>signup</>}
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
