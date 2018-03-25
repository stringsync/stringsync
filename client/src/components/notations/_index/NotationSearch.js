import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import Scroll from 'react-scroll';
import { Icon, Input, Affix } from 'antd';
import { compose, setDisplayName, setPropTypes, withHandlers, withProps, withState } from 'recompose';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import sonarSearch from 'assets/sonar-search.svg';

const scrollToTop = debounce(() => {
  Scroll.animateScroll.scrollToTop({
    duration: 100,
    smooth: true,
    offset: 5,
    ignoreCancelEvents: false
  });
}, 250, { leading: true });

const enhance = compose(
  setDisplayName('NotationSearch'),
  setPropTypes({
    onChange: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired,
    numQueried: PropTypes.number.isRequired
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
    handleChange: props => event => {
      scrollToTop();
      props.onChange(event);
    }
  }),
  withHandlers({
    handleClear: props => event => {
      props.focusInput();
      props.handleChange('');
    }
  }),
  withProps(props => {
    const suffix = props.query
      ? <Icon
          type="close-circle-o"
          onClick={props.handleClear}
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

const Results = styled('div')`
  text-align: center;
  margin-top: 24px;
  font-size: 24px;
`;

const SonarSearch = styled('img')`
  width: 50%;
`;

const RemoveFilter = styled('div')`
  margin: 0 auto;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  color: ${props => props.theme.primaryColor};

  &:hover {
    text-decoration: underline;
  }
`;

const NotationSearch = enhance(props => (
  <div id="notation-search">
    <Affix target={props.affixTarget} onChange={props.handleAffixChange}>
      <AffixInner viewportType={props.viewportType} affixed={props.affixed}>
        <InputOuter viewportType={props.viewportType}>
          <Input
            type="text"
            placeholder="filter"
            value={props.query}
            onChange={props.handleChange}
            prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
            suffix={props.suffix}
            ref={props.handleInputRef}
          />
        </InputOuter>
      </AffixInner>
    </Affix>
    <div>
      {
        props.query
          ? <Results>
              {props.numQueried} {`result${props.numQueried === 1 ? '' : 's'} for '${props.query}'`}
              <RemoveFilter onClick={props.handleClear}>
                remove filter
              </RemoveFilter>
              {
                props.numQueried === 0
                  ? <SonarSearch src={sonarSearch} alt="StringSync logo" />
                  : null
              }
            </Results>
          : null
      }
    </div>
  </div>
));

export default NotationSearch;
