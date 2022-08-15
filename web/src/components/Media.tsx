import { CSSProperties } from 'react';
import styled from 'styled-components';
import { useMemoCmp } from '../hooks/useMemoCmp';
import { Quality } from '../hooks/useNotationSettings';
import { MediaPlayer, QualitySelectionStrategy } from '../lib/MediaPlayer';
import { Player } from './Player';

const DEFAULT_QUALITY: Quality = { type: 'strategy', strategy: QualitySelectionStrategy.Auto };

const Outer = styled.div`
  width: 100%;
  background-color: black;
`;

type Props = {
  video: boolean;
  fluid?: boolean;
  src: string | null;
  style?: CSSProperties;
  quality?: Quality;
  onPlayerChange?: (mediaPlayer: MediaPlayer) => void;
};

export const Media: React.FC<Props> = (props) => {
  const fluid = props.fluid ?? true;
  const style = useMemoCmp(props.style);
  const quality = useMemoCmp(props.quality ?? DEFAULT_QUALITY);

  return (
    <Outer data-testid="media" style={style}>
      {/* hack to force the video to remount on fluid change */}
      {props.video && props.src && fluid && (
        <Player.Video
          playerOptions={{ fluid: true, sources: [{ src: props.src, type: 'application/x-mpegURL' }] }}
          quality={quality}
          onPlayerChange={props.onPlayerChange}
        />
      )}

      {/* hack to force the video to remount on fluid change */}
      {props.video && props.src && !fluid && (
        <Player.Video
          playerOptions={{ fluid: false, sources: [{ src: props.src, type: 'application/x-mpegURL' }] }}
          quality={quality}
          onPlayerChange={props.onPlayerChange}
        />
      )}

      {!props.video && props.src && (
        <Player.Audio
          playerOptions={{ fluid, sources: [{ src: props.src, type: 'application/x-mpegURL' }] }}
          quality={quality}
          onPlayerChange={props.onPlayerChange}
        />
      )}
    </Outer>
  );
};
