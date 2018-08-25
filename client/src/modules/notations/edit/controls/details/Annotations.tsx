import * as React from 'react';
import { compose, branch, renderNothing, withProps } from 'recompose';
import { Form } from 'antd';
import { Measure, MeasureElement, Annotations as AnnotationsModel } from 'models';
import { get, flatMap } from 'lodash';
import TextArea from 'antd/lib/input/TextArea';
import { withVextabChangeHandlers } from 'enhancers';

type TextData = [string, number, number];

interface IOuterProps {
  element: Measure | MeasureElement | null;
  editor: Store.IEditorState;
}

interface ITextProps extends IOuterProps {
  textData: TextData[];
}

interface IVextabChangeHandlersProps extends ITextProps {
  handleTextsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
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
  withVextabChangeHandlers<React.ChangeEvent<HTMLTextAreaElement>, ITextProps>({
    handleTextsChange: (props: IVextabChangeHandlersProps) => (e: React.ChangeEvent<HTMLTextAreaElement>, vextab) => {
      const { annotationNdx, textNdx } = e.currentTarget.dataset;
      const element = vextab.elements[props.editor.elementIndex];

      element.annotations[annotationNdx!].texts[textNdx!] = e.currentTarget.value;

      return vextab;
    }
  })
);  

export const Annotations = enhance(props => (
  <Form.Item>
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
        </Form.Item>
      ))
    }
  </Form.Item>
));
