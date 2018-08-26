import * as React from 'react';
import { compose, renderComponent, withProps } from 'recompose';
import { VextabElement, Measure as MeasureModel } from 'models';
import { Measure } from './Measure';
import { cond } from 'enhancers';
import { Bar } from './Bar';
import { ChordOrNote } from './ChordOrNote'
import { get } from 'lodash';
import { Rest } from './Rest';
import { Annotations } from './Annotations';
import { Directives } from './directives';

interface IOuterProps {
  element: MeasureModel | VextabElement | null;
  editor: Store.IEditorState;
  show?: 'annotations' | 'directives';
}

interface IElementTypeProps extends IOuterProps {
  elementType: (MeasureModel | VextabElement)['type'] | void;
}

const enhance = compose<IElementTypeProps, IOuterProps>(
  withProps((props: IOuterProps) => ({
    elementType: get(props.element, 'type')
  })),
  cond<IElementTypeProps>([
    [({ show, element }) => !!element && show === 'annotations', renderComponent(Annotations)],
    [({ show, element }) => !!element && show === 'directives', renderComponent(Directives)],
    [({ elementType }) => elementType === 'NOTE'   , renderComponent(ChordOrNote)],
    [({ elementType }) => elementType === 'CHORD'  , renderComponent(ChordOrNote)],
    [({ elementType }) => elementType === 'BAR'    , renderComponent(Bar)],
    [({ elementType }) => elementType === 'MEASURE', renderComponent(Measure)],
    [({ elementType }) => elementType === 'REST'   , renderComponent(Rest)]
  ])
);

export const Details = enhance(() => null);
