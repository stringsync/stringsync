import { Slider } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useMusicDisplayCursorSnapshot } from '../hooks/useMusicDisplayCursorSnapshot';
import { useSliderMarks } from '../hooks/useSliderMarks';
import { useTipFormatter } from '../hooks/useTipFormatter';
import { MediaPlayer } from '../lib/MediaPlayer';
import { MusicDisplay } from '../lib/MusicDisplay';
import * as notations from '../lib/notations';
import { Duration } from '../util/Duration';
import { NumberRange } from '../util/NumberRange';
import { Nullable } from '../util/types';

// TODO(jared): After rc-slider and/or antd updates, remove this. For some reason, this being set to true will cause
// safari browsers to freeze.
const TOOLTIP_VISIBLE = false;

const SLIDER_HANDLE_STYLE = { width: 21, height: 21, marginTop: -8 };

const SliderOuter = styled.div<{ $showDots: boolean }>`
  padding: 0 24px;
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
  notation: Nullable<notations.RenderableNotation>;
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
      mediaPlayer.suspend();

      const time = Duration.ms((value / 100) * durationMs);
      const loop = musicDisplay.getLoop();
      if (loop.isActive) {
        const start = time.ms;
        const end = time.plus(loop.timeRange.size).ms;
        if (end > durationMs) {
          loop.deactivate();
        } else {
          loop.update(NumberRange.from(start).to(end));
        }
      }

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
        handleStyle={SLIDER_HANDLE_STYLE}
        value={value}
        tooltipVisible={TOOLTIP_VISIBLE}
        tipFormatter={tipFormatter}
        onChange={onChange}
        onAfterChange={onAfterChange}
      />
    </SliderOuter>
  );
};
