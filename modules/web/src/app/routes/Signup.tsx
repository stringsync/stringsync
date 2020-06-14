import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FormPage } from '../../components/FormPage';
import Form from 'antd/lib/form/Form';

const Center = styled.div`
  text-align: center;
`;

const Signup: React.FC = () => {
  return (
    <div data-testid="signup">
      <FormPage
        main={<Form></Form>}
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
