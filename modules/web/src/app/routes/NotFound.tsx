import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface Props {}

const Outer = styled.div`
  text-align: center;
  margin-top: 24px;
`;

const NotFound: React.FC<Props> = () => {
  return (
    <Outer>
      <h1>page not found</h1>
      <Link to="/library">library</Link>
    </Outer>
  );
};

export default NotFound;
