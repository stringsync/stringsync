import { isNumber } from 'lodash';
import React, { useCallback } from 'react';
import { CursorSnapshot } from '../../../lib/MusicDisplay/locator';

type SliderTooltipProps = {
  currentTimestamp: string;
  durationTimestamp: string;
  currentMeasureNumber: string;
};

const SliderTooltip: React.FC<SliderTooltipProps> = React.memo((props) => {
  return (
    <>
      <div>
        {props.currentTimestamp} / {props.durationTimestamp}
      </div>
      <div>measure {props.currentMeasureNumber}</div>
    </>
  );
});

const timestamp = (ms: number): string => {
  const mins = Math.floor(ms / 60000);

  const leftoverMs = ms % 60000;
  const secs = Math.floor(leftoverMs / 1000);

  const minsStr = mins.toString().padStart(2, '0');
  const secsStr = secs.toString().padStart(2, '0');

  return `${minsStr}:${secsStr}`;
};

export const useTipFormatter = (cursorSnapshot: CursorSnapshot | null, durationMs: number) => {
  return useCallback(
    (value?: number | undefined) => {
      let currentTimestamp: string;
      let durationTimestamp: string;
      if (isNumber(value)) {
        const currentTimeMs = (value / 100) * durationMs;
        currentTimestamp = timestamp(currentTimeMs);
        durationTimestamp = timestamp(durationMs);
      } else {
        currentTimestamp = '?';
        durationTimestamp = '?';
      }

      const currentMeasureNumber = cursorSnapshot ? cursorSnapshot.getMeasureNumber().toString() : '0';

      return (
        <SliderTooltip
          currentMeasureNumber={currentMeasureNumber}
          currentTimestamp={currentTimestamp}
          durationTimestamp={durationTimestamp}
        />
      );
    },
    [cursorSnapshot, durationMs]
  );
};
