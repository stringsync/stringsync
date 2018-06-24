import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import { SessionProviderButtons } from './SessionProviderButtons';
import { compose } from 'recompose';
import { ViewportTypes } from 'data/viewport/getViewportType';

interface IOuterProps {
  title: string;
}

interface IInnerProps extends IOuterProps {
  viewportType: ViewportTypes;
}

const enhance = compose<IInnerProps, IOuterProps>(
  connect(
    (state: StringSync.Store.IState) => ({
      viewportType: state.viewport.type
    })
  )
);

interface IInnerDivProps {
  viewportType: ViewportTypes;
}

const Inner = styled('div')<IInnerDivProps>`
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

const OrContainer = styled('div')`
  text-align: center;
  margin: 0;
  margin-bottom: 10px;
  clear: both;
`;

const OrDiv = styled('div')`
  display: inline-block;
  font-size: 10px;
  padding: 10px;
  text-align: center;
  position: relative;
  background-color: white;
`;

const OrHr = styled('hr')`
  height: 0;
  border: 0;
  border-top: 1px solid ${props => props.theme.borderColor};
  position: relative;
  top: 25px;
`;

export const SessionFormWrapper = enhance(props => (
  <div>
    <Inner viewportType={props.viewportType}>
      {props.title ? <FormTitle className="main-title">{props.title}</FormTitle> : null}
      <SessionProviderButtons />
      <OrContainer>
        <OrHr />
        <OrDiv>or</OrDiv>
      </OrContainer>
      {props.children}
    </Inner>
  </div>
));
