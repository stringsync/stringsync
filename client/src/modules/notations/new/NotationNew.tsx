import * as React from 'react';
import { Box } from '../../../components/box/Box';
import { Lane } from '../../../components/lane';
import { Form, Input, Icon, Select, Upload, Button } from 'antd';
import { RouteComponentProps } from 'react-router';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import { IStore } from '../../../@types/store';
import { INotation } from '../../../@types/notation';

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

interface IFormProps extends RouteComponentProps<{ id: string }, {}> {
  form: WrappedFormUtils;
}

interface IConnectProps extends IFormProps {
  tags: any;
  notationId: number;
  fetchTags: () => void;
  resetNotation: () => void;
  createNotation: (notation: any) => void;
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

const enhance = compose<IInnerProps, any>(
  Form.create(),
  // connect(
  //   dispatch => ({
  //     // resetNotation: (notation: INotation) => dispatch(NotationsActions)
  //     setNotation: (notation: INotation) => dispatch(NotationActions.setNotation(notation)),
  //     setTags: (tags: ITag[]) => dispatch(TagActions.setTags(tags))
  //   })
  // ),
  lifecycle<IConnectProps, {}>({

  }),
  withState('loading', 'setLoading', false),
  withHandlers({
    afterValidate: (props: IStateProps) => async (errors: string[], fields: IFormFieldData) => {
      if (!errors) {
        try {
          await props.createNotation(getNotationParams(fields));
        } catch (error) {
          console.error(error);
          props.setLoading(false);
        }
      }
    }
  })
);

const getNotationParams = (fields: IFormFieldData) => ({
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

const noop = () => false;

const StyledButton = styled<any>(Button)`
  width: 100%;
`;

const StyledUpload = styled<any>(Upload)`
  width: 100%;
  .ant-upload.ant-upload-select {
    width: 100%;
  }
`;

const Center = styled('div')`
  display: flex;
  justify-content: center;
`;

export const NotationNew = enhance(props => (
  <Lane withTopMargin={true}>
    <Center>
      <Box title="upload" width={300} block={true}>
        <Form>
          <Form.Item>
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
          </Form.Item>
          <Form.Item>
            {props.form.getFieldDecorator('songName', {
              rules: [{ required: true, message: 'Song name cannot be blank' }],
            })(
              <Input
                disabled={props.loading}
                prefix={<Icon type="info-circle-o" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="song name"
              />
            )}
          </Form.Item>
          <Form.Item>
            {props.form.getFieldDecorator('artistName', {
              rules: [{ required: true, message: 'Artist name cannot be blank' }],
            })(
              <Input
                disabled={props.loading}
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="artist name"
              />
            )}
          </Form.Item>
          <Form.Item>
            {props.form.getFieldDecorator('tagIds', {
              rules: [{ required: true, message: 'Tags cannot be blank' }],
            })(
              <Select disabled={props.loading} mode="multiple" placeholder="tags">
                {[{ id: 1, name: 'foo' }].map(tag => (
                  <Select.Option key={tag.name} value={tag.id.toString()}>{tag.name}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            {props.form.getFieldDecorator('thumbnail', {
              rules: [{ required: true, message: 'Thumbnail name cannot be blank' }],
            })(
              <StyledUpload accept="image/*" beforeUpload={noop}>
                <StyledButton block={true} type="dashed" style={{ width: '100%' }}>
                  <Icon type="upload" />
                  Click to Upload
            </StyledButton>
              </StyledUpload>
            )}
          </Form.Item>
          <Form.Item>
            <StyledButton type="primary" htmlType="submit" loading={props.loading}>
              submit
        </StyledButton>
          </Form.Item>
        </Form>
      </Box>
    </Center>
  </Lane>
));
