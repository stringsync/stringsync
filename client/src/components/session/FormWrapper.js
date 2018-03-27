import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { compose, setDisplayName, setPropTypes } from 'recompose';
import { connect } from 'react-redux';
import { ProviderButtons } from './';

const enhance = compose(
  setDisplayName('FormWrapper'),
  connect(state => ({ viewportType: state.viewport.type })),
  setPropTypes({
    title: PropTypes.string
  })
);

const Inner = styled('div') `
  background: white;
  margin: 0 auto;
  margin-top: ${props => props.viewportType === 'MOBILE' ? '0' : '24px'};
  border-radius: ${props => props.viewportType === 'MOBILE' ? '0' : '4px'};
  border: ${props => props.viewportType === 'MOBILE' ? 'none' : `1px solid ${props.theme.borderColor}`};
  padding: 36px;
  max-width: ${props => props.viewportType === 'MOBILE' ? '100%' : '300px'};
`;

const FormTitle = styled('h1') `
  font-size: 24px;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const OrContainer = styled('div') `
  text-align: center;
  margin: 0;
  margin-bottom: 10px;
  clear: both;
`;

const OrDiv = styled('div') `
  display: inline-block;
  font-size: 10px;
  padding: 10px;
  text-align: center;
  position: relative;
  background-color: white;
`;

const OrHr = styled('hr') `
  height: 0;
  border: 0;
  border-top: 1px solid ${props => props.theme.borderColor};
  position: relative;
  top: 25px;
`;

const FormWrapper = enhance(props => (
  <div>
    <Inner viewportType={props.viewportType}>
      {props.title ? <FormTitle className="main-title">{props.title}</FormTitle> : null}
      <ProviderButtons />
      <OrContainer>
        <OrHr />
        <OrDiv>or</OrDiv>
      </OrContainer>
      {props.children}
    </Inner>
  </div>
));

export default FormWrapper;
