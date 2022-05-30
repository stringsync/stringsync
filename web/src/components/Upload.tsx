import { FormOutlined, PictureOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Steps, Upload as AntdUpload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as uuid from 'uuid';
import { Layout, withLayout } from '../hocs/withLayout';
import { useCreateNotation } from '../hooks/useCreateNotation';
import { useTags } from '../hooks/useTags';
import { UNKNOWN_ERROR_MSG } from '../lib/errors';
import { notify } from '../lib/notify';
import { compose } from '../util/compose';
import { Box } from './Box';

const { Step } = Steps;
const { Dragger } = AntdUpload;

const Outer = styled.div`
  margin-top: 48px;
`;

const Inner = styled.div`
  margin: 0 auto;
  max-width: 720px;
`;

const HideableFormItem = styled(Form.Item)<{ hidden: boolean }>`
  display: ${(props) => (props.hidden ? 'none' : 'block')};
`;

const enhance = compose(withLayout(Layout.DEFAULT));

type Props = {};

type Uploadable = {
  fileList: UploadFile[];
};

type FormValues = {
  video: Uploadable;
  thumbnail: Uploadable;
  songName: string;
  artistName: string;
};

const Upload: React.FC<Props> = enhance(() => {
  const navigate = useNavigate();
  const [stepNdx, setStepNdx] = useState(0);
  const [isNavigateAwayVisible, setNavigateAwayVisibility] = useState(false);
  const [pathname] = useState('');
  const [selectedTagNames, setSelectedTagNames] = useState(new Array<string>());
  const [tags] = useTags();

  const [form] = Form.useForm<FormValues>();
  const { video, thumbnail, songName, artistName } = form.getFieldsValue();

  const shouldBlockNavigation = useRef(true);
  shouldBlockNavigation.current = selectedTagNames.length > 0 || !!video || !!thumbnail || !!songName || !!artistName;

  const tagIdByTagName = tags.reduce<{ [key: string]: string }>((obj, tag) => {
    obj[tag.name] = tag.id;
    return obj;
  }, {});

  const { execute: createNotation, loading } = useCreateNotation({
    onData: (data) => {
      const showErrors = (errors: string[]) => {
        const id = uuid.v4();
        notify.modal.error({
          title: 'error',
          content: errors.map((error, ndx) => <div key={`modal-${id}-${ndx}`}>{error}</div>),
        });
      };

      switch (data.createNotation?.__typename) {
        case 'Notation':
          shouldBlockNavigation.current = false;
          const notationId = data.createNotation.id;
          navigate(`/n/${notationId}/edit`);
          break;
        case 'ValidationError':
          showErrors(data.createNotation.details);
          break;
        default:
          showErrors([data.createNotation?.message || UNKNOWN_ERROR_MSG]);
      }
    },
  });

  const onStepChange = (stepNdx: number) => {
    setStepNdx(stepNdx);
  };

  const dontUpload = (file: RcFile) => false;

  const onConfirmNavigationOk = () => {
    shouldBlockNavigation.current = false;
    navigate(pathname);
  };

  const onConfirmNavigationCancel = () => {
    setNavigateAwayVisibility(false);
  };

  const onTagSelect = (value: any) => {
    setSelectedTagNames([...selectedTagNames, value as string]);
  };

  const onTagDeselect = (value: any) => {
    setSelectedTagNames(selectedTagNames.filter((tagName) => tagName !== value));
  };

  const onFinish = () => {
    const { video, thumbnail, songName, artistName } = form.getFieldsValue();
    const tagIds = selectedTagNames.map((tagName) => tagIdByTagName[tagName]);
    const thumbnailFile = thumbnail && thumbnail.fileList[0].originFileObj;
    const videoFile = video && video.fileList[0].originFileObj;

    if (!thumbnailFile) {
      // the validator should prevent this from ever running
      return;
    }
    if (!videoFile) {
      // the validator should prevent this from ever running
      return;
    }

    createNotation({ input: { tagIds, thumbnail: thumbnailFile, video: videoFile, songName, artistName } });
  };

  return (
    <Outer data-testid="upload">
      <Modal
        title="confirm navigation"
        visible={isNavigateAwayVisible}
        onOk={onConfirmNavigationOk}
        onCancel={onConfirmNavigationCancel}
      >
        <p>are you sure you want to leave?</p>
      </Modal>

      <Inner>
        <Box>
          <Steps current={stepNdx} labelPlacement="vertical" onChange={onStepChange}>
            <Step icon={<VideoCameraOutlined />} title="video" />
            <Step icon={<PictureOutlined />} title="thumbnail" />
            <Step icon={<FormOutlined />} title="details" />
          </Steps>

          <br />
          <br />

          <Form form={form} onFinish={onFinish}>
            <HideableFormItem
              hasFeedback
              name="video"
              hidden={stepNdx !== 0}
              rules={[{ required: true, message: 'video required' }]}
            >
              <Dragger multiple={false} listType="picture" beforeUpload={dontUpload}>
                <p className="ant-upload-drag-icon">
                  <VideoCameraOutlined />
                </p>
                <p className="ant-upload-text">drag and drop a video file to upload</p>
                <p className="ant-upload-hint">your video will be private until you publish</p>
              </Dragger>
            </HideableFormItem>

            <HideableFormItem
              hasFeedback
              name="thumbnail"
              hidden={stepNdx !== 1}
              rules={[{ required: true, message: 'thumbnail required' }]}
            >
              <Dragger multiple={false} listType="picture" beforeUpload={dontUpload}>
                <p className="ant-upload-drag-icon">
                  <PictureOutlined />
                </p>
                <p className="ant-upload-text">drag and drop a thumbnail to upload</p>
                <p className="ant-upload-hint">your thumbnail will be private until you publish</p>
              </Dragger>
            </HideableFormItem>

            <HideableFormItem
              hasFeedback
              name="songName"
              hidden={stepNdx !== 2}
              rules={[{ required: true, message: 'song name required' }]}
            >
              <Input placeholder="song name" disabled={loading} />
            </HideableFormItem>

            <HideableFormItem
              hasFeedback
              name="artistName"
              hidden={stepNdx !== 2}
              rules={[{ required: true, message: 'artist name required' }]}
            >
              <Input placeholder="artist name" disabled={loading} />
            </HideableFormItem>

            <HideableFormItem hidden={stepNdx !== 2}>
              <Select
                mode="multiple"
                placeholder="tags"
                onSelect={onTagSelect}
                onDeselect={onTagDeselect}
                disabled={loading}
              >
                {tags.map((tag) => (
                  <Select.Option key={tag.id} value={tag.name}>
                    {tag.name}
                  </Select.Option>
                ))}
              </Select>
            </HideableFormItem>

            <HideableFormItem hidden={stepNdx !== 2}>
              <Button block type="primary" htmlType="submit" disabled={loading}>
                submit
              </Button>
            </HideableFormItem>
          </Form>
        </Box>
      </Inner>
    </Outer>
  );
});

export default Upload;
