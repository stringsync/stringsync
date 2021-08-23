import React from 'react';

export type SliderTooltipProps = {
  currentTimestamp: string;
  durationTimestamp: string;
  currentMeasureNumber: string;
};

export const SliderTooltip: React.FC<SliderTooltipProps> = React.memo((props) => {
  return (
    <>
      <div>
        {props.currentTimestamp} / {props.durationTimestamp}
      </div>
      <div>measure {props.currentMeasureNumber}</div>
    </>
  );
});
