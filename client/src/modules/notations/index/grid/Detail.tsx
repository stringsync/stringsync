import * as React from 'react';
import { Card, Divider, Tag, Skeleton } from 'antd';
import { Avatar } from '../../../../components/avatar';
import { get } from 'lodash';
import { INotation } from '../../../../@types/notation';
import { Img } from './Img';
import { compose, withStateHandlers } from 'recompose';

interface IOuterProps {
  notation: INotation;
  checkedTags: string[];
  loading?: boolean;
}

interface IStateProps extends IOuterProps {
  imgLoading: boolean;
  handleImgLoad: () => void;
}

const enhance = compose <IStateProps, IOuterProps>(
  withStateHandlers(
    { imgLoading: true },
    { handleImgLoad: () => () => ({ imgLoading: false }) }
  )
);

const Description = ({ songName, transcriberName }) => (
  <div>
    <span>{songName}</span>
    <Divider type="vertical" />
    <small>{transcriberName}</small>
  </div>
);

const Tags = ({ tags, checkedTags }) => (
  <div style={{ marginTop: '12px' }}>
    {tags.map(tag => (<Tag key={tag} color={checkedTags.has(tag) ? '#FC354C' : undefined}>{tag}</Tag>))}
  </div>
);

export const Detail = enhance(props => {
  const { thumbnailUrl, songName, artistName, tags, transcriber } = props.notation;
  const transcriberImg = get(transcriber, 'image', null);
  const transcriberName = get(transcriber, 'name', '');
  const checkedTags = new Set(props.checkedTags);

  return (
    <Card
      cover={
        <Img
          src={thumbnailUrl}
          alt={songName}
          loading={props.imgLoading}
          onLoad={props.handleImgLoad}
        />
      }
    >
      <Skeleton
        loading={props.loading || props.imgLoading}
        avatar={true}
        paragraph={{ rows: 1 }}
        active={true}
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
});
