import React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Wordmark } from '../../components/brand';

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
  const isFooterHidden = useSelector<RootState, boolean>((state) => {
    const { xs, sm, md } = state.viewport;
    return xs || sm || md;
  });

  return (
    <StyledLayout>
      <StyledHeader>
        <h1>
          <Wordmark />
        </h1>
      </StyledHeader>
      <Layout.Content>{props.children}</Layout.Content>;
      {isFooterHidden ? null : (
        <StyledFooter>StringSync LLC © 2019</StyledFooter>
      )}
    </StyledLayout>
  );
};

export default DefaultLayout;
