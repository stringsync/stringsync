import * as React from 'react';
import { Alert, Input } from 'antd';
import styled from 'react-emotion';
import { compose, branch, renderNothing, withHandlers } from 'recompose';
import { connect, Dispatch } from 'react-redux';
import { withVextab, IWithVextabProps } from 'enhancers';
import { NotationActions } from 'data';

const { TextArea } = Input;

interface IConnectProps {
  editorErrors: string[];
  vextabString: string;
  setVextabString: (vextabString: string) => void;
}

interface IHandlerProps extends IConnectProps {
  handleChange: (event: React.SyntheticEvent<HTMLTextAreaElement>) => void;
}

const enhance = compose<IHandlerProps, {}>(
  connect(
    (state: Store.IState) => ({
      editorErrors: state.editor.errors,
      vextabString: state.notation.vextabString
    }),
    (dispatch: Dispatch) => ({
      setVextabString: (vextabString: string) => dispatch(NotationActions.setVextabString(vextabString))
    })
  ),
  withHandlers({
    handleChange: (props: IConnectProps) => (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
      props.setVextabString(event.currentTarget.value);
    }
  }),
  branch<IConnectProps>(
    props => props.editorErrors.length === 0,
    renderNothing
  )
)

const Outer = styled('div')`
  width: 66%;
  margin: 0 auto;
  margin-top: 64px;
`;

const TextAreaOuter = styled('div')`
  margin-top: 24px;
`;

export const EditorErrors = enhance(props => (
  <Outer>
    <Alert
      type="error"
      showIcon={true}
      message="parse error"
      description={
        <div>
          {props.editorErrors.map((error, ndx) => <div key={`editor-error-${ndx}`}>{error}</div>)}
        </div>
      }
    />
    <TextAreaOuter>
      <TextArea
        rows={10}
        defaultValue={props.vextabString}
        onChange={props.handleChange}
      />
    </TextAreaOuter>
  </Outer>
));