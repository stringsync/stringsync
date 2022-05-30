import { SliderMarks } from 'antd/lib/slider';
import { useEffect, useState } from 'react';
import { MusicDisplay } from '../lib/MusicDisplay';
import { NumberRange } from '../util/NumberRange';

const FONT_SIZE = '0.75em';

const getInvisibleSliderMark = (): SliderMarks => {
  return {
    0: { label: '', style: { fontSize: FONT_SIZE } },
  };
};

export const useSliderMarks = (musicDisplay: MusicDisplay, durationMs: number): [SliderMarks, boolean] => {
  const [sliderMarks, setSliderMarks] = useState<SliderMarks>(getInvisibleSliderMark);

  useEffect(() => {
    const getSliderMarks = (timeMsRange: NumberRange): SliderMarks => {
      const start = (timeMsRange.start / durationMs) * 100;
      const end = (timeMsRange.end / durationMs) * 100;
      return {
        [start]: { label: '||:', style: { fontSize: FONT_SIZE } },
        [end]: { label: ':||', style: { fontSize: FONT_SIZE } },
      };
    };

    const eventBusIds = [
      musicDisplay.eventBus.subscribe('loopactivated', (payload) => {
        const nextSliderMarks = getSliderMarks(payload.loop.timeMsRange);
        setSliderMarks(nextSliderMarks);
      }),
      musicDisplay.eventBus.subscribe('loopupdated', (payload) => {
        if (payload.loop.isActive) {
          const nextSliderMarks = getSliderMarks(payload.loop.timeMsRange);
          setSliderMarks(nextSliderMarks);
        }
      }),
      musicDisplay.eventBus.subscribe('loopdeactivated', (payload) => {
        setSliderMarks(getInvisibleSliderMark());
      }),
    ];
    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay, durationMs]);

  const shouldShowDots = !!sliderMarks && Object.keys(sliderMarks).length === 1;
  return [sliderMarks, shouldShowDots];
};
