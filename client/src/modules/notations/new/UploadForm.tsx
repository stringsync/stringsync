import * as React from 'react';
import styled from 'react-emotion';
import { Form, Icon, Input, Button, Select, Upload } from 'antd';
import { compose, withState, withHandlers } from 'recompose';
import { Link } from 'react-router-dom';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormErrors } from 'modules/forms';

const { Item } = Form;
const { Option } = Select;

const YOUTUBE_REGEX = /^(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=)?([\w-]{10,})/;

interface IFormProps {
  form: WrappedFormUtils;
}

interface IStateProps extends IFormProps {
  loading: boolean;
  errors: string[];
  setLoading: (loading: boolean) => void;
  setErrors: (errors: string[]) => void;
}

interface IValidationProps extends IStateProps {
  afterValidate: (errors: string[]) => void;
}

interface IInnerProps extends IValidationProps {
  handleSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => void;
}

const enhance = compose<IInnerProps, {}>(
  Form.create(),
  withState('loading', 'setLoading', false),
  withState('errors', 'setErrors', []),
  withHandlers({
    afterValidate: () => (errors: string[]) => {
      if (!errors) {
        // do upload
      }
    }
  }),
  withHandlers({
    handleSubmit: (props: IValidationProps) => (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      props.setLoading(true);
      props.form.validateFields(props.afterValidate);
    }
  })
);

const Outer = styled('div')`
  transition: height 500ms ease-in;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

const StyledUpload = styled(Upload)`
  width: 100%;

  .ant-upload.ant-upload-select {
    width: 100%;
  }
`;

const Footer = styled('div')`
  width: 100%;
  text-align: center;
`;

const getFalse = () => false;

export const UploadForm = enhance(props => (
  <Outer>
    <Form onSubmit={props.handleSubmit}>
      <Item>
        {props.form.getFieldDecorator('youtubeUrl', {
          rules: [
            { required: true, message: 'YouTube URL cannot be blank' },
            { pattern: YOUTUBE_REGEX, message: 'must be valid YouTube URL' }
          ],
        })(
          <Input
            disabled={props.loading}
            prefix={<Icon type="video-camera" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="youtube url"
          />
        )}
      </Item>
      <Item>
        {props.form.getFieldDecorator('songName', {
          rules: [{ required: true, message: 'Song name cannot be blank' }],
        })(
          <Input
            disabled={props.loading}
            prefix={<Icon type="info-circle-o" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="song name"
          />
        )}
      </Item>
      <Item>
        {props.form.getFieldDecorator('artistName', {
          rules: [{ required: true, message: 'Artist name cannot be blank' }],
        })(
          <Input
            disabled={props.loading}
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="artist name"
          />
        )}
      </Item>
      <Item>
        {props.form.getFieldDecorator('tagIds', {
          rules: [{ required: true, message: 'Tags cannot be blank' }],
        })(
          <Select disabled={props.loading} mode="tags" placeholder="tags">
            {
              [{ name: 'foo', id: 1 }, { name: 'bar', id: 2 }].map(tag => (
                <Option key={tag.name} value={tag.id.toString()}>{tag.name}</Option>
              ))
            }
          </Select>
        )}
      </Item>
      <Item>
        {props.form.getFieldDecorator('thumbnail', {
          rules: [{ required: true, message: 'Thumbnail name cannot be blank' }],
        })(
          <StyledUpload accept="image/*" beforeUpload={getFalse}>
            <StyledButton type="dashed">
              <Icon type="upload" />
              Click to Upload
            </StyledButton>
          </StyledUpload>
        )}
      </Item>
      <Item>
        <StyledButton type="primary" htmlType="submit" loading={props.loading}>
          submit
        </StyledButton>
      </Item>
    </Form>
    <Footer>
      or <Link to="/">discover new music!</Link>
    </Footer>
    <Footer>
      <FormErrors errors={props.errors} />
    </Footer>
  </Outer>
));
