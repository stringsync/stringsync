import React, { ComponentType } from 'react';
import { Box } from './Box';
import styled from 'styled-components';
import { Row, Col } from 'antd';

const SPANS = {
  xs: 18,
  sm: 16,
  md: 8,
  lg: 7,
  xl: 6,
  xxl: 6,
};

const StyledRow = styled(Row)`
  margin-top: 24px;
`;

const StyledBox = styled(Box)`
  margin-top: 24px;
`;

type Props = {
  main: JSX.Element;
  footer?: JSX.Element;
};

export const FormPage: React.FC<Props> = (props) => {
  return (
    <div data-testid="form-page">
      <StyledRow justify="center">
        <Col {...SPANS}>
          <Box>{props.main}</Box>
          {props.footer ? <StyledBox>{props.footer}</StyledBox> : null}
        </Col>
      </StyledRow>
    </div>
  );
};
