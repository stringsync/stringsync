import * as React from 'react';
import styled from 'react-emotion';
import { compose, branch, renderNothing } from 'recompose';
import { ViewportTypes } from 'data/viewport/getViewportType';
import { connect } from 'react-redux';

interface IOuterProps {
  hidden?: boolean;
}

interface IInnerProps extends IOuterProps {
  songName: string;
  artistName: string;
  thumbnailUrl: string;
  viewportType: ViewportTypes;
}

const enhance = compose<IInnerProps, IOuterProps>(
  connect(
    (state: Store.IState) => ({
      artistName: state.notation.artistName,
      songName: state.notation.songName,
      thumbnailUrl: state.notation.thumbnailUrl,
      viewportType: state.viewport.type
    })
  ),
  branch<IInnerProps>(
    props => props.viewportType !== 'DESKTOP' || !props.thumbnailUrl,
    renderNothing
  )
);

// If you add a prop named "hidden", this will display: none.
interface IOuterDiv {
  $hidden: boolean;
}

const Outer = styled('div')<IOuterDiv>`
  opacity: ${props => props.$hidden ? 0 : 1};
  display: flex;
  margin: 0 8px;
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
  <Outer $hidden={!!props.hidden}>
    <Thumbnail src={props.thumbnailUrl} />
    <Detail>
      <ArtistName>{props.artistName}</ArtistName>
      <SongName>{props.songName}</SongName>
    </Detail>
  </Outer>
));
