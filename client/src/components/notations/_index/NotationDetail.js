import React from 'react';
import { Card, Tag } from 'antd';
import { compose, setDisplayName, setPropTypes, mapProps } from 'recompose';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

const enhance = compose(
  setDisplayName('NotationDetail'),
  setPropTypes({
    notation: PropTypes.object.isRequired,
    queryTags: PropTypes.object.isRequired
  }),
  /**
   * Map the prop values that are ultimately used in the component to keep
   * the component code less cluttered
   */
  mapProps(props => {
    const { thumbnail, songName, artistName } = props.notation.attributes;
    const tagNames = props.notation.relationships.tags.map(tag => tag.attributes.name).sort();
    const transcriberName = props.notation.relationships.transcriber.attributes.name;
    return { thumbnail, songName, artistName, tagNames, transcriberName };
  })
);

const CoverImg = styled('img')`
  width: 100%;
  height: 100%;
`;

const TagNames = styled('div')`
  margin-top: 12px;
`;

/**
 * Shows the detail for a given notation in the NotationIndex component
 */
const NotationDetail = enhance(props => (
  <Card
    hoverable
    cover={<CoverImg src={props.thumbnail} alt={props.songName} />}
  >
    <Card.Meta
      title={props.songName}
      description={`by ${props.artistName} | ${props.transcriberName}`}
    />
    <TagNames>
      {
        props.tagNames.map(tagName => (
          <Tag
            key={tagName}
            color={props.queryTags.has(tagName) ? '#FC354C' : null}
          >
            {tagName}
          </Tag>)
        )
      }
    </TagNames>
  </Card>
));

export default NotationDetail;
