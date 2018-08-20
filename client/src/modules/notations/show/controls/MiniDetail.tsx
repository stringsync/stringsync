import * as React from 'react';
import { compose } from 'recompose';
import styled from 'react-emotion';
import { connect } from 'react-redux';

interface IInnerProps {
  songName: string;
  artistName: string;
  thumbnailUrl: string;
}

const enhance = compose<IInnerProps, {}>(
  connect(
    (state: StringSync.Store.IState) => {
      const { songName, artistName, thumbnailUrl } = state.notations.show;
      return { songName, artistName, thumbnailUrl };
    }
  )
);

const Outer = styled('div')`
  display: flex;
`;

const Detail = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 12px;
`;

const Thumbnail = styled('img')`
  min-width: 36px;
  min-height: 36px;
  width: 36px;
  height: 36px;
`;

const ArtistName = styled('span')`
  color: #999;
  font-size: 10px;
  line-height: 18px;
  height: 18px;
  overflow: hidden;
`;

const SongName = styled('span')`
  font-size: 10px;
  line-height: 18px;
  height: 18px;
  overflow: hidden;
`;

export const MiniDetail = enhance(props => (
  <Outer>
    <Thumbnail src={props.thumbnailUrl} />
    <Detail>
      <ArtistName>{props.artistName}</ArtistName>
      <SongName>{props.songName}</SongName>
    </Detail>
  </Outer>
));
