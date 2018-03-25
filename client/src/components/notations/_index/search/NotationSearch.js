import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import styled from 'react-emotion';
import { Icon, Input, Affix, Tag } from 'antd';
import { NotationSearchResults } from './';
import { compose, setDisplayName, setPropTypes, withHandlers, withProps, withState } from 'recompose';
import { connect } from 'react-redux';
import { debounce } from 'lodash';

const scrollToTop = debounce(() => {
  Scroll.animateScroll.scrollToTop({
    duration: 200,
    smooth: true,
    offset: 5,
    ignoreCancelEvents: true
  });
}, 250, { leading: true, trailing: true });

const enhance = compose(
  setDisplayName('NotationSearch'),
  setPropTypes({
    queryString: PropTypes.string.isRequired,
    onQueryStringChange: PropTypes.func.isRequired,
    queryTags: PropTypes.object.isRequired,
    onQueryTagsChange: PropTypes.func.isRequired,
    numQueried: PropTypes.number.isRequired,
    clearQueries: PropTypes.func.isRequired,
    tagOptions: PropTypes.arrayOf(PropTypes.string).isRequired
  }),
  connect(state => ({ viewportType: state.viewport.type })),
  withHandlers({
    handleQueryStringChange: props => event => {
      scrollToTop();
      props.onQueryStringChange(event);
    },
    handleQueryTagsChange: props => tag => checked => {
      scrollToTop();

      const { queryTags } = props;
      if (checked) {
        queryTags.add(tag);
      } else {
        queryTags.delete(tag);
      }

      props.onQueryTagsChange(queryTags);
    }
  }),
  withHandlers({
    handleClear: props => event => {
      scrollToTop();
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
    affixOffsetBottom: props.viewportType === 'MOBILE' ? 0 : null
  })),
  withState('affixed', 'setAffixed', false),
  withHandlers({ handleAffixChange: props => affixed => props.setAffixed(affixed) })
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

const TagsOuter = styled('div')`
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const NotationSearch = enhance(props => (
  <div id="notation-search">
    <Affix
      ref={props.handleAffixRef}
      onChange={props.handleAffixChange}
      offsetBottom={props.affixOffsetBottom}
    >
      <AffixInner viewportType={props.viewportType} affixed={props.affixed}>
        <InputOuter viewportType={props.viewportType}>
          <Input
            type="text"
            placeholder="song, artist, or transcriber name"
            value={props.queryString}
            prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
            onChange={props.handleQueryStringChange}
            suffix={props.suffix}
            ref={props.handleInputRef}
          />
          <TagsOuter>
            {
              props.tagOptions.map(tag => (
                <Tag.CheckableTag
                  key={tag}
                  onChange={props.handleQueryTagsChange(tag)}
                  checked={props.queryTags.has(tag)}
                  style={{ marginTop: '2px' }}
                >
                  {tag}
                </Tag.CheckableTag>
              ))
            }
          </TagsOuter>
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
