import * as React from 'react';
import styled from 'react-emotion';
import { Avatar } from 'components';
import { Card, Tag } from 'antd';
import { compose, withProps } from 'recompose';
import { kebabCase } from 'lodash';

const { Meta } = Card;

interface IOuterProps {
  notation: Notation.INotation;
  queryTags: Set<string>;
}

interface IInnerProps extends IOuterProps {
  thumbnailUrl: string;
  songName: string;
  artistName: string;
  tags: string[];
  transcriberName: string;
  transcriberImage: string | null;
}

const enhance = compose<IInnerProps, IOuterProps>(
  withProps((props: IOuterProps) => {
    const { thumbnailUrl, songName, artistName, tags } = props.notation;

    const { transcriber } = props.notation;
    const transcriberName = transcriber && transcriber.name;
    const transcriberImage = transcriber && transcriber.image;

    return { thumbnailUrl, songName, artistName, tags, transcriberName, transcriberImage };
  })
);

const CoverImg = styled('img')`
  width: 100%;
  height: 100%;
`;

const Tags = styled('div')`
  margin-top: 12px;
`;

/**
 * Shows the detail for a given notation in the NotationIndex component
 */
export const Detail = enhance(props => (
  <Card cover={<CoverImg src={props.thumbnailUrl} alt={kebabCase(props.songName)} />}>
    <Meta
      avatar={<Avatar src={props.transcriberImage} name={props.transcriberName} />}
      title={props.songName}
      description={`by ${props.artistName} | ${props.transcriberName}`}
    />
    <Tags>
      {
        props.tags.map(tag => (
          <Tag
            key={tag}
            color={props.queryTags.has(tag) ? '#FC354C' : undefined}
          >
            {tag}
          </Tag>)
        )
      }
    </Tags>
  </Card>
));
