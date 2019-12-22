import React from 'react';
import { Layout, Row, Col, Divider } from 'antd';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Wordmark } from '../../components/wordmark';
import { Logo } from '../../components/logo';
import { Link } from 'react-router-dom';
import Menu from './Menu';

const StyledLogo = styled(Logo)`
  font-size: 22px;
`;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Layout.Header)`
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 16px;
`;

const StyledFooter = styled(Layout.Footer)`
  text-align: center;
`;

const Lane = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

export const DefaultLayout: React.FC = (props) => {
  const isLtEqMdViewport = useSelector<RootState, boolean>((state) => {
    const { xs, sm, md } = state.viewport;
    return xs || sm || md;
  });

  return (
    <StyledLayout data-testid="default-layout">
      <StyledHeader>
        <Lane>
          <Row type="flex" justify="space-between">
            <Col>
              <Link to="library">
                <StyledLogo />
                {isLtEqMdViewport ? null : (
                  <>
                    <Divider type="vertical" />
                    <Wordmark />
                  </>
                )}
              </Link>
            </Col>
            <Col>
              <Menu />
            </Col>
          </Row>
        </Lane>
      </StyledHeader>
      <Layout.Content>
        <Lane>{props.children}</Lane>
      </Layout.Content>
      {isLtEqMdViewport ? null : (
        <StyledFooter>
          <Lane>StringSync LLC © 2019</Lane>
        </StyledFooter>
      )}
    </StyledLayout>
  );
};
