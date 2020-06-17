import React from 'react';
import { Box } from './Box';
import styled from 'styled-components';
import { Row, Col, Alert } from 'antd';
import { Link } from 'react-router-dom';
import { Wordmark } from './Wordmark';

const SPANS = {
  xs: 18,
  sm: 16,
  md: 10,
  lg: 8,
  xl: 7,
  xxl: 6,
};

const StyledRow = styled(Row)`
  margin-top: 24px;
`;

const MaxWidth = styled.div`
  max-width: 320px;
  margin: 0 auto;
`;

const StyledBox = styled(Box)`
  margin-top: 24px;
`;

const StyledH1 = styled.h1`
  text-align: center;
  font-size: 32px;
`;

const StyledAlert = styled(Alert)`
  width: 100%;
  max-width: 320px;
  && {
    margin: 0 auto;
    margin-top: 24px;
  }
`;

const StyledUl = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

type Props = {
  wordmarked?: boolean;
  main: JSX.Element;
  footer?: JSX.Element;
  errors?: string[];
  onErrorsClose?: React.MouseEventHandler<HTMLButtonElement>;
};

export const FormPage: React.FC<Props> = (props) => {
  const hasErrors = props.errors && props.errors.length > 0;

  return (
    <StyledRow data-testid="form-page" justify="center" align="middle">
      <Col {...SPANS}>
        <MaxWidth>
          <StyledBox>
            {props.wordmarked ? (
              <Link to="library">
                <StyledH1>
                  <Wordmark />
                </StyledH1>
              </Link>
            ) : null}
            {props.main}
          </StyledBox>
          {hasErrors ? (
            <StyledAlert
              closable
              type="error"
              showIcon
              onClose={props.onErrorsClose}
              message="Error"
              description={
                <StyledUl>
                  {props.errors!.map((error, ndx) => {
                    return <li key={ndx}>{error}</li>;
                  })}
                </StyledUl>
              }
            />
          ) : null}
          {props.footer ? <StyledBox>{props.footer}</StyledBox> : null}
        </MaxWidth>
      </Col>
    </StyledRow>
  );
};
