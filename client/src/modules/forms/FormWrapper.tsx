import * as React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ViewportTypes } from 'data/viewport/getViewportType';
import styled from 'react-emotion';

interface IOuterProps {
  title?: string;
}

interface IInnerProps extends IOuterProps {
  viewportType: ViewportTypes;
}

const enhance = compose<IInnerProps, IOuterProps>(
  connect(
    (state: Store.IState) => ({
      viewportType: state.viewport.type
    })
  )
);

interface IOuterDivProps {
  viewportType: ViewportTypes;
}

const Outer = styled('div')<IOuterDivProps>`
  background: white;
  margin: 0 auto;
  margin-top: ${props => props.viewportType === 'MOBILE' ? '0' : '24px'};
  border-radius: ${props => props.viewportType === 'MOBILE' ? '0' : '4px'};
  border: ${props => props.viewportType === 'MOBILE' ? 'none' : `1px solid ${props.theme.borderColor}`};
  padding: 36px;
  max-width: ${props => props.viewportType === 'MOBILE' ? '100%' : '350px'};
`;

const FormTitle = styled('h1')`
  font-size: 24px;
  text-align: center;
  margin-top: 8px;
  margin-bottom: 16px;
`;

export const FormWrapper = enhance(props => (
  <Outer viewportType={props.viewportType}>
    {props.title ? <FormTitle className="main-title">{props.title}</FormTitle> : null}
    {props.children}
  </Outer>
));
