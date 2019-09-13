import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const StyledFooter = styled(Layout.Footer)`
  text-align: center;
`;

interface Props {}

const Footer: React.FC<Props> = (props) => {
  const isHidden = useSelector<RootState, boolean>((state) => {
    const { xs, sm, md } = state.viewport;
    return xs || sm || md;
  });

  return isHidden ? null : <StyledFooter>StringSync LLC © 2019 </StyledFooter>;
};

export default Footer;
