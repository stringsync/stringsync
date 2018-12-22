import * as React from 'react';
import { Box } from '../../components/box';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';
import { Button, Row } from 'antd';

const Outer = styled('div')`
  margin: 0 auto;
  margin-top: 64px;
  display: flex;
  justify-content: center;
`;

export const Contact = () => (
  <Outer>
    <Box title="contact">
      <ul>
        <li>E: <a href="mailto:stringsynced@gmail.com">stringsynced@gmail.com</a></li>
        <li>IG: <a href="https://instagram.com/stringsynced">@stringsynced</a></li>
      </ul>
      <Row type="flex" justify="center">
        <Button type="primary">
          <Link to="/">home</Link>
        </Button>
      </Row>
    </Box>
  </Outer>
);
