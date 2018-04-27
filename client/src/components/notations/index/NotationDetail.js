import React from 'react';
import { Card, Tag } from 'antd';
import { compose, setDisplayName, setPropTypes, withProps } from 'recompose';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { kebabCase } from 'lodash';

const enhance = compose(
  setDisplayName('NotationDetail'),
  setPropTypes({
    notation: PropTypes.object.isRequired,
    queryTags: PropTypes.object.isRequired
  }),
  withProps(props => {
    const { thumbnailUrl, songName, artistName } = props.notation.attributes;
    const tagNames = props.notation.relationships.tags.map(tag => tag.attributes.name).sort();
    const transcriberName = props.notation.relationships.transcriber.attributes.name;

    return { thumbnailUrl, songName, artistName, tagNames, transcriberName };
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
  <Card cover={<CoverImg src={props.thumbnailUrl} alt={kebabCase(props.songName)} />}>
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
