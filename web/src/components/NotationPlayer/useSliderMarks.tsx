import { VerticalLeftOutlined, VerticalRightOutlined } from '@ant-design/icons';
import { SliderMarks } from 'antd/lib/slider';
import { useEffect, useState } from 'react';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { NumberRange } from '../../util/NumberRange';

export const useSliderMarks = (musicDisplay: MusicDisplay | null, durationMs: number): SliderMarks | undefined => {
  const [sliderMarks, setSliderMarks] = useState<SliderMarks | undefined>(undefined);

  useEffect(() => {
    if (!musicDisplay) {
      return;
    }

    const getSliderMarks = (timeMsRange: NumberRange): SliderMarks => {
      const start = (timeMsRange.start / durationMs) * 100;
      const end = (timeMsRange.end / durationMs) * 100;
      return {
        [start]: { label: <VerticalLeftOutlined />, style: { fontSize: '0.75em' } },
        [end]: { label: <VerticalRightOutlined />, style: { fontSize: '0.75em' } },
      };
    };

    const eventBusIds = [
      musicDisplay.eventBus.subscribe('loopactivated', (payload) => {
        const nextSliderMarks = getSliderMarks(payload.loop.timeMsRange);
        setSliderMarks(nextSliderMarks);
      }),
      musicDisplay.eventBus.subscribe('selectionupdated', (payload) => {
        const nextSliderMarks = getSliderMarks(musicDisplay.getLoop().selection.toRange());
        setSliderMarks(nextSliderMarks);
      }),
      musicDisplay.eventBus.subscribe('loopdeactivated', (payload) => {
        setSliderMarks(undefined);
      }),
    ];
    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay, durationMs]);

  return sliderMarks;
};
