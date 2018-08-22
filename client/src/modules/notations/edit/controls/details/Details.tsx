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
import { Form, Alert } from 'antd';
import { Annotations } from './Annotations';
import { Directives } from './directives';

interface IOuterProps {
  element: MeasureModel | MeasureElement | null;
  show?: 'annotations' | 'directives';
}

interface IElementTypeProps extends IOuterProps {
  elementType: (MeasureModel | MeasureElement)['type'] | void;
}

const enhance = compose<IElementTypeProps, IOuterProps>(
  withProps((props: IOuterProps) => ({
    elementType: get(props.element, 'type')
  })),
  cond<IElementTypeProps>([
    [({ show, element }) => !!element && show === 'annotations', renderComponent(Annotations)],
    [({ show, element }) => !!element && show === 'directives', renderComponent(Directives)],
    [({ elementType }) => elementType === 'NOTE'   , renderComponent(Note)],
    [({ elementType }) => elementType === 'CHORD'  , renderComponent(Chord)],
    [({ elementType }) => elementType === 'BAR'    , renderComponent(Bar)],
    [({ elementType }) => elementType === 'MEASURE', renderComponent(Measure)],
    [({ elementType }) => elementType === 'REST'   , renderComponent(Rest)]
  ])
);

export const Details = enhance(() => null);
