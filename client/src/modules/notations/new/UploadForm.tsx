import * as React from 'react';
import styled from 'react-emotion';
import { Form, Icon, Input, Button, Select, Upload } from 'antd';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import { Link } from 'react-router-dom';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormErrors } from 'modules/forms';
import { connect, Dispatch } from 'react-redux';
import { fetchAllTags } from 'data/tags';
import { get } from 'lodash';
import { ICreateNotation, createNotation } from 'data';

const { Item } = Form;
const { Option } = Select;

const YOUTUBE_REGEX = /^(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=)?([\w-]{10,})/;

interface IFormFieldData {
  artistName: string;
  songName: string;
  tagIds: string[];
  thumbnail: {
    file: File;
    fileList: File[];
  };
  youtubeUrl: string;
}

const getNotationParams = (fields: IFormFieldData): ICreateNotation => ({
  artist_name: fields.artistName,
  bpm: 120,
  dead_time_ms: 0,
  duration_ms: 60,
  song_name: fields.songName,
  tag_ids: fields.tagIds,
  thumbnail: fields.thumbnail.file,
  vextab_string: '',
  video: {
    kind: 'YOUTUBE',
    src: fields.youtubeUrl
  }
});

interface IFormProps {
  form: WrappedFormUtils;
}

interface IConnectProps extends IFormProps {
  tags: Tag.ITag[];
  fetchAllTags: () => void;
  createNotation: (notation: ICreateNotation) => void;
}

interface IStateProps extends IConnectProps {
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
  connect(
    (state: StringSync.Store.IState) => ({
      tags: state.tags.index
    }),
    (dispatch: Dispatch) => ({
      createNotation: (notation: ICreateNotation) => dispatch(createNotation(notation) as any),
      fetchAllTags: () => dispatch(fetchAllTags() as any)
    })
  ),
  withState('loading', 'setLoading', false),
  withState('errors', 'setErrors', []),
  withHandlers({
    afterValidate: (props: IStateProps) => async (errors: string[], fields: IFormFieldData) => {
      if (!errors) {
        try {
          await props.createNotation(getNotationParams(fields));
        } catch (error) {
          console.error(error);
          const responseErrors = (
            get(error.responseJSON, 'errors') ||
            [{ details: 'Something went wrong' }]
          );
          props.setErrors(
            responseErrors.map((errorObj: any) => errorObj.details)
          );
        }
      }

      props.setLoading(false);
    }
  }),
  withHandlers({
    handleSubmit: (props: IValidationProps) => (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      props.setLoading(true);
      props.form.validateFields(props.afterValidate);
    }
  }),
  lifecycle<IInnerProps, {}>({
    componentDidMount(): void {
      this.props.fetchAllTags();
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
          <Select disabled={props.loading} mode="multiple" placeholder="tags">
            {
              props.tags.map(tag => (
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
