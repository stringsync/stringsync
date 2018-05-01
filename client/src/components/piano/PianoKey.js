import React from 'react';
import { compose, branch, renderComponent, setPropTypes } from 'recompose';
import { BlackPianoKey, WhitePianoKey } from './';
import { isEqual } from 'lodash';
import styled from 'react-emotion';
import PropTypes from 'prop-types';

const enhance = compose(
  setPropTypes({
    note: PropTypes.string.isRequired
  }),
  branch(
    props => props.note.includes('#'),
    renderComponent(props => <BlackPianoKey note={props.note} />),
    renderComponent(props => <WhitePianoKey note={props.note} />)
  )
);

const PianoKey = enhance(() => null);

export default PianoKey;
