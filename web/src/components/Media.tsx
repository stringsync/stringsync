import styled from 'styled-components';
import { MediaPlayer } from '../lib/MediaPlayer';
import { Player } from './Player';

const Outer = styled.div<{ $video: boolean }>`
  width: 100%;
  display: ${(props) => (props.$video ? 'inherit' : 'none')};
  background-color: black;
`;

type Props = {
  skeleton?: boolean;
  video: boolean;
  fluid?: boolean;
  src: string | null;
  onPlayerChange?: (mediaPlayer: MediaPlayer) => void;
};

export const Media: React.FC<Props> = (props) => {
  const fluid = props.fluid ?? true;

  return (
    <Outer data-testid="media" $video={props.video}>
      {/* hack to force the video to remount on fluid change */}
      {props.video && props.src && fluid && (
        <Player.Video
          playerOptions={{ fluid: true, sources: [{ src: props.src, type: 'application/x-mpegURL' }] }}
          onPlayerChange={props.onPlayerChange}
        />
      )}

      {/* hack to force the video to remount on fluid change */}
      {props.video && props.src && !fluid && (
        <Player.Video
          playerOptions={{ fluid: false, sources: [{ src: props.src, type: 'application/x-mpegURL' }] }}
          onPlayerChange={props.onPlayerChange}
        />
      )}

      {!props.video && props.src && (
        <Player.Audio
          playerOptions={{ fluid, sources: [{ src: props.src, type: 'application/x-mpegURL' }] }}
          onPlayerChange={props.onPlayerChange}
        />
      )}
    </Outer>
  );
};
