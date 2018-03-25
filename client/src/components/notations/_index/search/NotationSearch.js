import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import styled from 'react-emotion';
import { Icon, Input, Affix } from 'antd';
import { NotationSearchResults } from './';
import { compose, setDisplayName, setPropTypes, withHandlers, withProps, withState } from 'recompose';
import { connect } from 'react-redux';
import { debounce } from 'lodash';

const scrollToTop = debounce(() => {
  Scroll.animateScroll.scrollToTop({
    duration: 200,
    smooth: true,
    offset: 5,
    ignoreCancelEvents: false
  });
}, 250, { leading: true, trailing: true });

const enhance = compose(
  setDisplayName('NotationSearch'),
  setPropTypes({
    queryString: PropTypes.string.isRequired,
    onQueryStringChange: PropTypes.func.isRequired,
    queryTags: PropTypes.arrayOf(PropTypes.string).isRequired,
    onQueryTagsChange: PropTypes.func.isRequired,
    numQueried: PropTypes.number.isRequired,
    clearQueries: PropTypes.func.isRequired,
    tagOptions: PropTypes.arrayOf(PropTypes.string).isRequired
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
    handleQueryStringChange: props => event => {
      scrollToTop();
      props.onQueryStringChange(event);
    },
    handleQueryTagsChange: props => event => {
      scrollToTop();
      props.onQueryTagsChange(event);
    }
  }),
  withHandlers({
    handleClear: props => event => {
      scrollToTop();
      props.focusInput();
      props.clearQueries();
    }
  }),
  withProps(props => {
    const suffix = props.queryString
      ? <Icon type="close-circle-o" onClick={props.handleClear} style={{ cursor: 'pointer' }} />
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

const Tags = styled('div')`
  margin-top: 8px;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const NotationSearch = enhance(props => (
  <div id="notation-search">
    <Affix target={props.affixTarget} onChange={props.handleAffixChange}>
      <AffixInner viewportType={props.viewportType} affixed={props.affixed}>
        <InputOuter viewportType={props.viewportType}>
          <Input
            type="text"
            placeholder="filter"
            value={props.queryString}
            prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
            onChange={props.handleQueryStringChange}
            suffix={props.suffix}
            ref={props.handleInputRef}
          />
        </InputOuter>
      </AffixInner>
    </Affix>
    <NotationSearchResults
      queryString={props.queryString}
      queryTags={props.queryTags}
      numQueried={props.numQueried}
      onClear={props.handleClear}
    />
  </div>
));

export default NotationSearch;
