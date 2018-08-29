import * as React from 'react';
import { compose, branch, renderNothing, withProps } from 'recompose';
import { Form, Button } from 'antd';
import { Measure, VextabElement, Annotations as AnnotationsModel, Bar } from 'models';
import { get, last, flatMap } from 'lodash';
import TextArea from 'antd/lib/input/TextArea';
import { withEditorHandlers } from 'enhancers';

type TextData = [string, number, number];

type EventTypes = React.ChangeEvent<HTMLTextAreaElement> | React.SyntheticEvent<HTMLButtonElement>;

interface IOuterProps {
  element: Measure | VextabElement | null;
  editor: Store.IEditorState;
}

interface ITextProps extends IOuterProps {
  textData: TextData[];
}

interface IVextabChangeHandlersProps extends ITextProps {
  addAnnotation: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
  handleTextsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  removeAnnotation: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
}

const mapTextData = (annotations: AnnotationsModel[]): TextData[] => (
  flatMap(annotations, (annotation, annotationNdx) => (
    annotation.texts.map((text, textNdx) => [text, annotationNdx, textNdx] as TextData))
  )
);

const enhance = compose<IVextabChangeHandlersProps, IOuterProps>(
  branch<IOuterProps>(props => !props.element, renderNothing),
  withProps((props: IOuterProps) => {
    const annotations: AnnotationsModel[] = get(props.element, 'annotations', []);
    const textData = mapTextData(annotations);

    return { textData };
  }),
  withEditorHandlers<EventTypes, ITextProps>({
    addAnnotation: props => (e: React.SyntheticEvent<HTMLButtonElement>, vextab) => {
      const element = vextab.elements[props.editor.elementIndex];
      
      element.annotations.push(new AnnotationsModel(['*']));

      return vextab;
    },
    handleTextsChange: props => (e: React.ChangeEvent<HTMLTextAreaElement>, vextab) => {
      const { annotationNdx, textNdx } = e.currentTarget.dataset;
      const element = vextab.elements[props.editor.elementIndex];

      element.annotations[annotationNdx!].texts[textNdx!] = e.currentTarget.value;

      return vextab;
    },
    removeAnnotation: props => (e: React.SyntheticEvent<HTMLButtonElement>, vextab) => {
      const { annotationNdx, textNdx } = e.currentTarget.dataset;
      const element = vextab.elements[props.editor.elementIndex];

      const annotation = element.annotations[annotationNdx!]
      annotation.texts.splice(parseInt(textNdx!, 10), 1);

      if (annotation.texts.length === 0) {
        element.annotations.splice(parseInt(annotationNdx!, 10), 1);
      }

      return vextab;
    }
  })
);

export const Annotations = enhance(props => (
  <Form>
    <Form.Item>
      <Button
        disabled={!props.element || props.element instanceof Bar || props.element instanceof Measure }
        onClick={props.addAnnotation}
      >
        add
      </Button>
    </Form.Item>
    {
      props.textData.map(([text, annotationNdx, textNdx]) => (
        <Form.Item
          key={`${props.editor.elementIndex}-annotations-${annotationNdx}-${textNdx}`}
        >
          <TextArea
            data-annotation-ndx={annotationNdx}
            data-text-ndx={textNdx}
            onChange={props.handleTextsChange}
            defaultValue={text}
          />
          <Button
            data-annotation-ndx={annotationNdx}
            data-text-ndx={textNdx}
            onClick={props.removeAnnotation}
          >
            remove
          </Button>
        </Form.Item>
      ))
    }
  </Form>
));
