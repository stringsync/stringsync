import * as React from 'react';
import { compose, mapProps } from 'recompose';
import { withVextabChangeHandlers } from 'enhancers';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { get, last, findLastIndex } from 'lodash';
import { Bar, Rest, Rhythm, Measure, VextabMeasureSpec, Note, TimeSignature, Line, Key } from 'models';
import { ElementTypes } from './ElementManager';
import { connect, Dispatch } from 'react-redux';
import { EditorActions } from 'data';

interface IOuterProps {
  elementType: ElementTypes;
  elementIndex: number;
}

interface IConnectProps extends IOuterProps {
  setElementIndex: (elementIndex: number) => void;
}

interface IHandlerProps extends IConnectProps {
  handleButtonClick: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

interface IMappedProps {
  onClick: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

const getRest = () => {
  const rhythm = new Rhythm('4', false);
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

const enhance = compose<IMappedProps & ButtonProps, IOuterProps & ButtonProps>(
  connect(
    null,
    (dispatch: Dispatch) => ({
      setElementIndex: (elementIndex: number) => dispatch(EditorActions.setElementIndex(elementIndex))
    })
  ),
  withVextabChangeHandlers<React.SyntheticEvent<HTMLButtonElement>, IConnectProps>({
    // FIXME: this logic should live on the backend models
    handleButtonClick: props => (event, vextab) => {
      const measure = get(vextab.elements[props.elementIndex], 'measure') as Measure | void;

      // Create the element to add
      switch (props.elementType) {
        case 'MEASURE':
          const newMeasure = getMeasure(get(measure, 'spec'));

          let line: Line
          if (vextab.lines.length === 0) {
            line = new Line(0, []);
            vextab.lines.push(line);
            line.measures.push(newMeasure);
          } else if (measure) {
            line = measure.line as Line;
            line.measures.splice(line.measures.indexOf(measure), 0, newMeasure);
          } else {
            line = last(vextab.lines) as Line;
            line.measures.push(newMeasure);
          }

          newMeasure.line = line;

          const bar = newMeasure.elements[0];
          props.setElementIndex(vextab.elements.indexOf(bar));
          return vextab;

        case 'REST':
          if (!measure) {
            return;
          }

          const rest = getRest();
          measure.elements.push(rest);
          props.setElementIndex(vextab.elements.indexOf(rest));
          return vextab;

        case 'NOTE':
          const note = new Note('C', 5, [{ fret: 1, str: 2 }]);

          if (!measure) {
            return;
          }

          measure.elements.push(note);
          props.setElementIndex(vextab.elements.indexOf(note));
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
    delete nextProps.setElementIndex;

    return nextProps;
  })
)

export const AddElement = enhance(props => <Button {...props} />);
