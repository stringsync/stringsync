import { Slider } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { MediaPlayer } from '../../lib/MediaPlayer';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { Duration } from '../../util/Duration';
import { Nullable } from '../../util/types';
import { useMusicDisplayCursorSnapshot } from './hooks/useMusicDisplayCursorSnapshot';
import { useSliderMarks } from './hooks/useSliderMarks';
import { useTipFormatter } from './hooks/useTipFormatter';
import { RenderableNotation } from './types';

const SliderOuter = styled.div<{ $showDots: boolean }>`
  padding: 0 16px 0 16px;
  margin: 0;
  width: 100%;

  .ant-slider-with-marks {
    margin: inherit;
  }

  .ant-slider-dot {
    ${(props) => (props.$showDots ? 'display: none;' : '')}
  }
`;

type Props = {
  musicDisplay: MusicDisplay;
  mediaPlayer: MediaPlayer;
  notation: Nullable<RenderableNotation>;
};

export const Seekbar: React.FC<Props> = (props) => {
  // props
  const musicDisplay = props.musicDisplay;
  const mediaPlayer = props.mediaPlayer;
  const notation = props.notation;

  // slider props
  const durationMs = notation ? notation.durationMs : 0;
  const [marks, shouldShowDots] = useSliderMarks(musicDisplay, durationMs);
  const [value, setValue] = useState(0);
  useEffect(() => {
    const eventBusIds = [
      mediaPlayer.eventBus.subscribe('timechange', (payload) => {
        const nextValue = (payload.time.ms / durationMs) * 100;
        setValue(nextValue);
      }),
    ];
    return () => {
      mediaPlayer.eventBus.unsubscribe(...eventBusIds);
    };
  }, [mediaPlayer, durationMs]);
  const cursorSnapshot = useMusicDisplayCursorSnapshot(musicDisplay);
  const tipFormatter = useTipFormatter(cursorSnapshot, durationMs);
  const onChange = useCallback(
    (value: number) => {
      musicDisplay.getLoop().deactivate();
      mediaPlayer.suspend();
      const time = Duration.ms((value / 100) * durationMs);
      mediaPlayer.seek(time);
    },
    [durationMs, musicDisplay, mediaPlayer]
  );
  const onAfterChange = useCallback(() => {
    mediaPlayer.unsuspend();
  }, [mediaPlayer]);

  return (
    <SliderOuter $showDots={shouldShowDots}>
      <Slider
        step={0.01}
        marks={marks}
        handleStyle={{ width: 21, height: 21, marginTop: -8 }}
        value={value}
        tipFormatter={tipFormatter}
        onChange={onChange}
        onAfterChange={onAfterChange}
      />
    </SliderOuter>
  );
};
