import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { Input, Tag, Icon } from 'antd';
import { compose, setDisplayName, setPropTypes, withProps, withHandlers } from 'recompose';
import { scrollToTop } from './';

const enhance = compose(
  setDisplayName('NotationSearchInputs'),
  setPropTypes({
    queryString: PropTypes.string.isRequired,
    queryTags: PropTypes.object.isRequired,
    onQueryStringChange: PropTypes.func.isRequired,
    onQueryTagsChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    tagOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
    viewportType: PropTypes.string.isRequired
  }),
  withHandlers({
    handleQueryStringChange: props => event => {
      if (props.viewportType !== 'MOBILE') {
        scrollToTop();
      }

      props.onQueryStringChange(event);
    },
    handleQueryTagsChange: props => tag => checked => {
      if (props.viewportType !== 'MOBILE') {
        scrollToTop();
      }

      const nextQueryTags = new Set([...props.queryTags]);
      if (checked) {
        nextQueryTags.add(tag);
      } else {
        nextQueryTags.delete(tag);
      }

      props.onQueryTagsChange(nextQueryTags);
    }
  }),
  withProps(props => {
    const suffix = props.queryString
      ? <Icon type="close-circle-o" onClick={props.handleClear} style={{ cursor: 'pointer' }} />
      : null

    return { suffix }
  })
);

const Outer = styled('div') `
  max-width: ${props => props.viewportType === 'MOBILE' ? '95%' : '100%'};
  margin: ${props => props.viewportType === 'TABLET' ? '0 16px' : '0 auto'};
`;

const TagsOuter = styled('div') `
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

/**
 * This component handles setting the queryString and queryTags for the NotationIndex
 */
const NotationSearchInputs = enhance(props => (
  <Outer id="notation-search-input" viewportType={props.viewportType}>
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
        props.tagOptions.map(tagName => (
          <Tag.CheckableTag
            key={tagName}
            onChange={props.handleQueryTagsChange(tagName)}
            checked={props.queryTags.has(tagName)}
            style={{ marginTop: '2px' }}
          >
            {tagName}
          </Tag.CheckableTag>
        ))
      }
    </TagsOuter>
  </Outer>
));

export default NotationSearchInputs;
