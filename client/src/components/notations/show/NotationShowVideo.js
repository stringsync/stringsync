import React from 'react';
import { Video, Overlap, Layer } from 'components';
import styled from 'react-emotion';
import { compose } from 'recompose';
import { connect } from 'react-redux';

const enhance = compose(
  connect(
    state => ({
      songName: state.notation.show.songName,
      thumbnailUrl: state.notation.show.thumbnailUrl
    })
  )
);

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

const NotationShowVideo = props => (
  <div>
    <Overlap>
      <Layer style={{ zIndex: 10 }}>
        <BackgroundImg src={props.thumbnailUrl} alt={props.songName} />
      </Layer>
      <Layer style={{ zIndex: 11 }}>
        <BackgroundMask />
      </Layer>
      <Layer style={{ zIndex: 12 }}>
        <VideoContainer>
          <Video />
        </VideoContainer>
      </Layer>
    </Overlap>
  </div>
);

export default NotationShowVideo;
