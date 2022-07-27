import { CSSProperties } from 'react';
import styled from 'styled-components';
import { useMemoCmp } from '../hooks/useMemoCmp';
import { MediaPlayer } from '../lib/MediaPlayer';
import { Player } from './Player';

const Outer = styled.div`
  width: 100%;
  background-color: black;
`;

type Props = {
  video: boolean;
  fluid?: boolean;
  src: string | null;
  style?: CSSProperties;
  onPlayerChange?: (mediaPlayer: MediaPlayer) => void;
};

export const Media: React.FC<Props> = (props) => {
  const fluid = props.fluid ?? true;
  const style = useMemoCmp(props.style);

  return (
    <Outer data-testid="media" style={style}>
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
