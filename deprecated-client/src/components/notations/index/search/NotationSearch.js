import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { Affix } from 'antd';
import { NotationSearchResults, NotationSearchInputs, scrollToTop } from './';
import { compose, setDisplayName, setPropTypes, withHandlers, withProps, withState } from 'recompose';

const enhance = compose(
  setDisplayName('NotationSearch'),
  setPropTypes({
    queryString: PropTypes.string.isRequired,
    onQueryStringChange: PropTypes.func.isRequired,
    queryTags: PropTypes.object.isRequired,
    onQueryTagsChange: PropTypes.func.isRequired,
    numQueried: PropTypes.number.isRequired,
    clearQueries: PropTypes.func.isRequired,
    tagOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
    viewportType: PropTypes.string.isRequired
  }),
  withProps(props => ({
    affixOffsetBottom: props.viewportType === 'MOBILE' ? 0 : null
  })),
  /**
   * The AffixInner styled component needs knowledge of its parent affix
   */
  withState('affixed', 'setAffixed', false),
  withHandlers({
    handleAffixChange: props => affixed => props.setAffixed(affixed)
  }),
  withHandlers({
    handleClear: props => event => {
      if (props.viewportType !== 'MOBILE') {
        scrollToTop();
      }

      props.clearQueries();
    }
  }),
);

const AffixInner = styled('div')`
  background: ${props => props.affixed ? '#FFFFFF' : 'transparent'};
  padding: ${props => props.affixed ? '24px' : '0'};
  transition: all 150ms ease-in;
`;

/**
 * This component is responsible for handling the _layout_ of the notation index's
 * search inputs and results
 */
const NotationSearch = enhance(props => (
  <div id="notation-search">
    <Affix
      ref={props.handleAffixRef}
      onChange={props.handleAffixChange}
      offsetBottom={props.affixOffsetBottom}
    >
      <AffixInner affixed={props.affixed}>
        <NotationSearchInputs
          queryString={props.queryString}
          queryTags={props.queryTags}
          onQueryStringChange={props.onQueryStringChange}
          onQueryTagsChange={props.onQueryTagsChange}
          onClear={props.handleClear}
          tagOptions={props.tagOptions}
          viewportType={props.viewportType}
        />
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
