import React from 'react';
import { Layout, Row, Col, Divider } from 'antd';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Wordmark } from '../../components/brand';
import Logo from '../../components/brand/logo/Logo';
import { Link } from 'react-router-dom';

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Layout.Header)`
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
`;

const StyledFooter = styled(Layout.Footer)`
  text-align: center;
`;

const DefaultLayout: React.FC = (props) => {
  const isLtMdViewport = useSelector<RootState, boolean>((state) => {
    const { xs, sm, md } = state.viewport;
    return xs || sm || md;
  });

  return (
    <StyledLayout>
      <StyledHeader>
        <Row type="flex" justify="space-between">
          <Col>
            <Link to="/library">
              <Logo size={28} />
              {!isLtMdViewport ? (
                <>
                  <Divider type="vertical" />
                  <Wordmark />
                </>
              ) : null}
            </Link>
          </Col>
          <Col>menu</Col>
        </Row>
      </StyledHeader>
      <Layout.Content>{props.children}</Layout.Content>;
      {isLtMdViewport ? null : (
        <StyledFooter>StringSync LLC © 2019</StyledFooter>
      )}
    </StyledLayout>
  );
};

export default DefaultLayout;
