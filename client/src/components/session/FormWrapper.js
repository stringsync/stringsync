import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { compose, setDisplayName, setPropTypes } from 'recompose';
import { connect } from 'react-redux';

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
  padding: 24px;
  max-width: ${props => props.viewportType === 'MOBILE' ? '100%' : '300px'};
`;

const FormTitle = styled('h1') `
  font-size: 24px;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const FormWrapper = enhance(props => (
  <div>
    <Inner>
      {props.title ? <FormTitle>{props.title}</FormTitle> : null}
      {props.children}
    </Inner>
  </div>
));

export default FormWrapper;
