import React from 'react';
import { compose, setDisplayName, setPropTypes, withHandlers, withProps, withState } from 'recompose';
import { Icon, Input, Affix } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

const enhance = compose(
  setDisplayName('NotationSearch'),
  setPropTypes({
    onChange: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired
  }),
  connect(
    state => ({
      viewportType: state.viewport.type
    })
  ),
  withHandlers(() => {
    let input = null;

    return {
      handleInputRef: () => ref => {
        input = ref;
      },
      focusInput: () => () => {
        if (input) {
          input.focus();
        }
      }
    }
  }),
  withHandlers({
    handleClearClick: props => event => {
      props.focusInput();
      props.onChange('');
    }
  }),
  withProps(props => {
    const suffix = props.query
      ? <Icon
          type="close-circle-o"
          onClick={props.handleClearClick}
          style={{ cursor: 'pointer' }}
        />
      : null

    return { suffix }
  }),
  withProps(props => ({
    affixTarget: () => window
  })),
  withState('affixed', 'setAffixed', false),
  withHandlers({
    handleAffixChange: props => affixed => {
      props.setAffixed(affixed);
    }
  })
);

const AffixInner = styled('div')`
  background: ${props => props.affixed ? '#FFFFFF' : 'transparent'};
  padding: ${props => props.affixed ? '24px' : '0'};
  transition: all 150ms ease-in;
`;

const InputOuter = styled('div')`
  max-width: ${props => props.viewportType === 'MOBILE' ? '90%' : '100%'};
  margin: ${props => props.viewportType === 'TABLET' ? '0 16px' : '0 auto'};
`;

const NotationSearch = enhance(props => (
  <div>
    <Affix target={props.affixTarget} onChange={props.handleAffixChange}>
      <AffixInner viewportType={props.viewportType} affixed={props.affixed}>
        <InputOuter viewportType={props.viewportType}>
          <Input
            type="text"
            placeholder="filter"
            value={props.query}
            onChange={props.onChange}
            prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
            suffix={props.suffix}
            ref={props.handleInputRef}
          />
        </InputOuter>
      </AffixInner>
    </Affix>
  </div>
));

export default NotationSearch;
