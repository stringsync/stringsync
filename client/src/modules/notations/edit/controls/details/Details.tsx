import * as React from 'react';
import { compose, renderComponent, withProps } from 'recompose';
import { MeasureElement, Measure as MeasureModel } from 'models';
import { Measure } from './Measure';
import { cond } from 'enhancers';
import { Bar } from './Bar';
import { Chord } from './Chord';
import { Note } from './Note';
import { get } from 'lodash';
import { Rest } from './Rest';


interface IOuterProps {
  element: MeasureModel | MeasureElement | null;
}

interface IElementTypeProps extends IOuterProps {
  elementType: (MeasureModel | MeasureElement)['type'] | void;
}

const enhance = compose<IElementTypeProps, IOuterProps>(
  withProps((props: IOuterProps) => ({
    elementType: get(props.element, 'type')
  })),
  cond<IElementTypeProps>([
    [({ elementType }) => elementType === 'NOTE'   , renderComponent(Note)],
    [({ elementType }) => elementType === 'CHORD'  , renderComponent(Chord)],
    [({ elementType }) => elementType === 'BAR'    , renderComponent(Bar)],
    [({ elementType }) => elementType === 'MEASURE', renderComponent(Measure)],
    [({ elementType }) => elementType === 'REST'   , renderComponent(Rest)]
  ])
);

export const Details = enhance(() => (
  <div>
    none
  </div>
));
