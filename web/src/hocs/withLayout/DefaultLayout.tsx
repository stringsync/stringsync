import { Col, Layout, Row } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Logo } from '../../components/Logo';
import { Wordmark } from '../../components/Wordmark';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { RootState } from '../../store';
import { Menu } from './Menu';

const metas = document.getElementsByTagName('meta');
const version = metas.namedItem('version')?.content || '';
export const VERSION = version ? `v${version}` : 'v?.?,?';

const StyledLayout = styled(Layout)`
  && {
    min-height: 100vh;
  }
`;

const StyledHeader = styled(Layout.Header)`
  && {
    background: #ffffff;
    border-bottom: 1px solid #e8e8e8;
    padding: 0 16px;
    display: flex;
    align-items: center;
  }
`;

const StyledFooter = styled(Layout.Footer)`
  text-align: center;
  font-size: 10px;
  color: ${(props) => props.theme['@muted-color']};
`;

const Lane = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

const Offline = styled.em`
  font-weight: lighter;
  color: ${(props) => props.theme['@muted']};
`;

type Props = {
  withContentLane: boolean;
};

export const DefaultLayout: React.FC<Props> = (props) => {
  const location = useLocation();
  const isGtMdViewport = useSelector<RootState, boolean>(
    (state) => state.viewport.lg || state.viewport.xl || state.viewport.xxl
  );

  const isOnline = useOnlineStatus();
  const isWordmarkVisible = isOnline && isGtMdViewport;
  const isOfflineVisible = !isOnline;
  const logoLinkTo = location.pathname.startsWith('/library') ? '/' : '/library';

  return (
    <StyledLayout data-testid="default-layout">
      <StyledHeader>
        <Lane>
          <Row align="middle" justify="space-between">
            <Col>
              <Link to={logoLinkTo}>
                <Row align="middle" gutter={8}>
                  <Col>
                    <Row align="middle">
                      <Logo size={22} />
                    </Row>
                  </Col>
                  {isWordmarkVisible && (
                    <Col>
                      <Wordmark />
                    </Col>
                  )}
                  {isOfflineVisible && (
                    <Col>
                      <Offline>offline</Offline>
                    </Col>
                  )}
                </Row>
              </Link>
            </Col>
            <Col>
              <Menu />
            </Col>
          </Row>
        </Lane>
      </StyledHeader>
      <Layout.Content>{props.withContentLane ? <Lane>{props.children}</Lane> : props.children}</Layout.Content>
      {isGtMdViewport && (
        <StyledFooter>
          <Lane>{VERSION}</Lane>
        </StyledFooter>
      )}
    </StyledLayout>
  );
};
