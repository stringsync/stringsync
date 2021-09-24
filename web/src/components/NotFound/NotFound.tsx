import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface Props {}

const Outer = styled.div`
  text-align: center;
  margin-top: 24px;
`;

export const NotFound: React.FC<Props> = () => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `404 - ${originalTitle}`;
    return () => {
      document.title = originalTitle;
    };
  }, []);

  return (
    <Outer>
      <h1>404</h1>
      <h2>not found</h2>
      <Link to="/library">library</Link>
    </Outer>
  );
};
