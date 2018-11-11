import * as React from 'react';
import { Card, Divider, Tag, Skeleton } from 'antd';
import styled from 'react-emotion';
import { Avatar } from '../../../../components/avatar';
import { get } from 'lodash';
import { INotation } from '../../../../@types/notation';

interface IProps {
  notation: INotation;
  checkedTags: string[];
  loading?: boolean;
}

const TagsOuter = styled('div')`
  margin-top: 12px;
`;

const CoverImg = styled('img')`
  width: 100%;
  height: 100%;
`;

const Description = ({ songName, transcriberName }) => (
  <div>
    <span>{songName}</span>
    <Divider type="vertical" />
    <small>{transcriberName}</small>
  </div>
);

const Tags = ({ tags, checkedTags }) => (
  <TagsOuter>
    {tags.map(tag => (<Tag key={tag} color={checkedTags.has(tag) ? '#FC354C' : undefined}>{tag}</Tag>))}
  </TagsOuter>
);

export const Detail: React.SFC<IProps> = props => {
  const { thumbnailUrl, songName, artistName, tags, transcriber } = props.notation;
  const transcriberImg = get(transcriber, 'image', null);
  const transcriberName = get(transcriber, 'name', '');
  const checkedTags = new Set(props.checkedTags);

  return (
    <Card cover={<CoverImg src={thumbnailUrl} alt={songName} />}>
      <Skeleton
        loading={props.loading}
        avatar={true}
      >
        <Card.Meta
          avatar={<Avatar src={transcriberImg} name={transcriberName} />}
          title={artistName}
          description={<Description songName={songName} transcriberName={transcriberName} />}
        />
        <Tags tags={tags} checkedTags={checkedTags} />
      </Skeleton>
    </Card>
  );
};
