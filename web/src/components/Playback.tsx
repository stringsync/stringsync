import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { MediaPlayer } from '../lib/MediaPlayer';

const MIN = 0.2;
const MAX = 1.5;
const STEP = 0.1;
const DEFAULT = 1;

const Outer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
`;

const StyledButton = styled(Button)`
  color: ${(props) => props.theme['@muted']};
  border: none;
  box-shadow: none;
  background-color: transparent;
`;

const Stat = styled.span`
  font-size: 1.5em;
`;

type Props = {
  mediaPlayer: MediaPlayer;
};

export const Playback: React.FC<Props> = (props) => {
  // props
  const mediaPlayer = props.mediaPlayer;

  // playback management
  const [playback, setPlayback] = useState(() => mediaPlayer.getPlayback());

  useEffect(() => {
    const eventBusIds = [
      mediaPlayer.eventBus.subscribe('playbackchange', (payload) => {
        setPlayback(payload.playback);
      }),
    ];
    return () => {
      mediaPlayer.eventBus.unsubscribe(...eventBusIds);
    };
  }, [mediaPlayer]);

  // callbacks
  const onMinusClick = () => {
    mediaPlayer.setPlayback(Math.max(MIN, playback - STEP));
  };
  const onPlusClick = () => {
    mediaPlayer.setPlayback(Math.min(MAX, playback + STEP));
  };
  const onResetClick = () => {
    mediaPlayer.setPlayback(DEFAULT);
  };

  return (
    <Outer>
      <StyledButton
        size="large"
        shape="circle"
        icon={<MinusOutlined />}
        disabled={playback === MIN}
        onClick={onMinusClick}
      />

      <Stat>{playback.toFixed(1)}</Stat>

      <StyledButton
        size="large"
        shape="circle"
        icon={<PlusOutlined />}
        disabled={playback === MAX}
        onClick={onPlusClick}
      />
      <StyledButton size="large" shape="circle" onClick={onResetClick} disabled={playback === DEFAULT}>
        R
      </StyledButton>
    </Outer>
  );
};
