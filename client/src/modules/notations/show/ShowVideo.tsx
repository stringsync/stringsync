import * as React from 'react';
import { Video, Overlap, Layer } from 'components';
import styled from 'react-emotion';
import { compose } from 'recompose';
import { connect } from 'react-redux';

interface IInnerProps {
  songName: string;
  backgroundImgSrc: string;
}

const enhance = compose<IInnerProps, {}>(
  connect(
    (state: Store.IState) => ({
      backgroundImgSrc: state.notation.thumbnailUrl,
      songName: state.notation.songName
    })
  )
);

const Outer = styled('div')`
  background: black;
  height: 250px;
  width: 100%;
  min-height: 200px;
  overflow: hidden;
  
  iframe {
    height: 250px;
    width: 100%;
    min-height: 200px;
  }
`;

const BackgroundImg = styled('img')`
  width: 100%;
  height: auto;
  filter: blur(20px);
  margin: 0 auto;
  box-sizing: border-box;
`;

const BackgroundMask = styled('div')`
  width: 100%;
  background: black;
  opacity: 0.75;
  height: 250px;
`;

const VideoContainer = styled('div')`
  max-width: 53.33333vh;
  height: 250px;
  min-width: 200px;
  min-height: 200px;
  margin: 0 auto;
`;

export const ShowVideo = enhance(props => (
  <Outer>
    <Overlap>
      <Layer zIndex={10}>
        <BackgroundImg src={props.backgroundImgSrc} alt={props.songName} />
      </Layer>
      <Layer zIndex={11}>
        <BackgroundMask />
      </Layer>
      <Layer zIndex={12}>
        <VideoContainer>
          <Video />
        </VideoContainer>
      </Layer>
    </Overlap>
  </Outer>
));
