import { Col, Layout, Row } from 'antd';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Logo } from '../../components/Logo';
import { Wordmark } from '../../components/Wordmark';
import { useViewportState } from '../../ctx/viewport/useViewportState';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { Menu } from './Menu';

const metas = document.getElementsByTagName('meta');
const version = metas.namedItem('version')?.content || '';
export const VERSION = version ? `v${version}` : 'v?.?,?';

export const HEADER_HEIGHT_PX = 64;

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
    height: ${HEADER_HEIGHT_PX}px;
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
  lanes: boolean;
  footer: boolean;
};

export const DefaultLayout: React.FC<Props> = (props) => {
  const location = useLocation();
  const { lg, xl, xxl } = useViewportState();
  const isGtMd = lg || xl || xxl;

  const isOnline = useOnlineStatus();
  const isWordmarkVisible = isOnline && isGtMd;
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
      <Layout.Content>{props.lanes ? <Lane>{props.children}</Lane> : props.children}</Layout.Content>
      {props.footer && isGtMd && (
        <StyledFooter>
          <Lane>{VERSION}</Lane>
        </StyledFooter>
      )}
    </StyledLayout>
  );
};
