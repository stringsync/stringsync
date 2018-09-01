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
  removeText: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
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
    addAnnotation: () => (_, editor) => {
      editor.addAnnotations();
    },
    handleTextsChange: () => (e: React.ChangeEvent<HTMLTextAreaElement>, editor) => {
      const { annotationNdx, textNdx } = e.currentTarget.dataset;
      editor.updateText(
        parseInt(annotationNdx!, 10), parseInt(textNdx!, 10), e.currentTarget.value
      );
    },
    removeText: () => (e: React.SyntheticEvent<HTMLButtonElement>, editor) => {
      const { annotationNdx, textNdx } = e.currentTarget.dataset;
      editor.removeText(parseInt(annotationNdx!, 10), parseInt(textNdx!, 10));
    }
  })
);

export const Annotations = enhance(props => (
  <Form>
    <Form.Item>
      <Button
        disabled={!props.element}
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
            onClick={props.removeText}
          >
            remove
          </Button>
        </Form.Item>
      ))
    }
  </Form>
));
