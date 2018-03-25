import React from 'react';
import { Card, Tag } from 'antd';
import { compose, setDisplayName, setPropTypes, mapProps } from 'recompose';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

const enhance = compose(
  setDisplayName('NotationDetail'),
  setPropTypes({
    notation: PropTypes.object.isRequired,
    onTagClick: PropTypes.func
  }),
  mapProps(props => {
    const { thumbnail, songName, artistName } = props.notation.attributes;
    const tagNames = props.notation.relationships.tags.map(tag => tag.attributes.name).sort();
    return { thumbnail, songName, artistName, tagNames, onTagClick: props.onTagClick };
  })
);

const CoverImg = styled('img')`
  width: 100%;
  height: 100%;
`;

const TagNames = styled('div')`
  margin-top: 12px;
`;

const NotationDetail = enhance(props => (
  <Card
    hoverable
    cover={<CoverImg src={props.thumbnail} alt={props.songName} />}
  >
    <Card.Meta
      title={props.songName}
      description={props.artistName}
    />
    <TagNames>
      {
        props.tagNames.map(tagName => (
          <Tag key={tagName} color="#FC354C">
            {tagName}
          </Tag>
        ))
      }
    </TagNames>
  </Card>
));

export default NotationDetail;
