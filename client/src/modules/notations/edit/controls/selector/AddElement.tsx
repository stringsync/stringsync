import * as React from 'react';
import { compose, mapProps } from 'recompose';
import { withVextabChangeHandlers } from 'enhancers';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { get } from 'lodash';
import { Bar, Rest, Rhythm, Measure, VextabMeasureSpec, Note, TimeSignature, Line, Key } from 'models';
import { ElementTypes } from './ElementManager';

const getRest = () => {
  const rhythm = new Rhythm('1', false);
  return new Rest(0, rhythm);
}

const getMeasure = (spec: VextabMeasureSpec | void) => {
  let measureSpec: VextabMeasureSpec;
  if (!spec) {
    const note = new Note('C', 4, [{ str: 2, fret: 1 }]);
    const key = new Key(note);
    const timeSignature = new TimeSignature(4, 4);
    measureSpec = new VextabMeasureSpec(key, timeSignature);
  } else {
    measureSpec = spec.clone();
  }

  const bar = new Bar('single');
  const rest = getRest();
  return new Measure([bar, rest], 0, measureSpec);
}

interface IOuterProps {
  elementType: ElementTypes;
  elementIndex: number;
}

interface IHandlerProps extends IOuterProps {
  handleButtonClick: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

interface IMappedProps {
  onClick: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

const enhance = compose<IMappedProps & ButtonProps, IOuterProps & ButtonProps>(
  withVextabChangeHandlers<React.SyntheticEvent<HTMLButtonElement>, IOuterProps>({
    handleButtonClick: (props: IOuterProps) => (event, vextab) => {
      const measure = get(vextab.elements[props.elementIndex], 'measure') as Measure | void;

      // Create the element to add
      switch (props.elementType) {
        case 'MEASURE':
          const line = get(measure, 'line') as Line | void;
          const newMeasure = getMeasure(get(measure, 'spec'));

          if (line) {
            line.add(newMeasure);
          } else {
            const newLine = new Line(0, [newMeasure]);
            vextab.lines.push(newLine);
          }

          return vextab;

        case 'REST':
          if (!measure) {
            return;
          }

          measure.add(getRest(), props.elementIndex)
          return vextab;

        case 'NOTE':
          const note = new Note('C', 5, [{ fret: 1, str: 2 }]);

          if (!measure) {
            return;
          }

          measure.add(note, props.elementIndex);
          return vextab;

        default:
          return;
      }
    }
  }),
  mapProps((props: IHandlerProps & ButtonProps) => {
    const nextProps = Object.assign({}, props);

    nextProps.onClick = props.handleButtonClick;
    delete nextProps.handleButtonClick;
    delete nextProps.elementIndex;
    delete nextProps.elementType;

    return nextProps;
  })
)

export const AddElement = enhance(props => <Button {...props} />);
