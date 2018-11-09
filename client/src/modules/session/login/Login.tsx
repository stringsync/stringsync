import * as React from 'react';
import { ContentLane } from '../../../components/content-lane/ContentLane';
import { Box } from '../../../components/box/Box';
import { Row, Col } from 'antd';
import { OAuthButtons } from '../OAuthButtons';
import { Link } from 'react-router-dom';
import styled from 'react-emotion';

const Home = styled('div')`
  text-align: center;
  margin-top: 16px;
`;

export const Login = () => (
  <ContentLane withPadding={true} withTopMargin={true}>
    <Row type="flex" justify="center">
      <Col>
        <Box title="login">
          <OAuthButtons />
          <Home>
            <Link to="/">home</Link>
          </Home>
        </Box>
      </Col>
    </Row>
  </ContentLane>
);
