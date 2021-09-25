import { FormOutlined, PictureOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Steps, Upload as AntdUpload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { get } from 'lodash';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { Tag } from '../../domain';
import { $queries } from '../../graphql';
import { Layout, withLayout } from '../../hocs';
import { useEffectOnce } from '../../hooks/useEffectOnce';
import { getTags, RootState } from '../../store';
import { compose } from '../../util/compose';
import { Box } from '../Box';

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
  file: {
    originFileObj: File;
  };
};

type FormValues = {
  video: Uploadable;
  thumbnail: Uploadable;
  songName: string;
  artistName: string;
};

const Upload: React.FC<Props> = enhance(() => {
  const history = useHistory();
  const dispatch = useDispatch();
  const tags = useSelector<RootState, Tag[]>((state) => state.tag.tags);
  const [stepNdx, setStepNdx] = useState(0);
  const [isNavigateAwayVisible, setNavigateAwayVisibility] = useState(false);
  const [pathname, setPathname] = useState('');
  const [selectedTagNames, setSelectedTagNames] = useState(new Array<string>());

  const [form] = Form.useForm<FormValues>();
  const { video, thumbnail, songName, artistName } = form.getFieldsValue();

  const shouldBlockNavigation = useRef(true);
  shouldBlockNavigation.current = selectedTagNames.length > 0 || !!video || !!thumbnail || !!songName || !!artistName;

  const tagIdByTagName = tags.reduce<{ [key: string]: string }>((obj, tag) => {
    obj[tag.name] = tag.id;
    return obj;
  }, {});

  const onStepChange = (stepNdx: number) => {
    setStepNdx(stepNdx);
  };

  const dontUpload = (file: RcFile) => false;

  const onConfirmNavigationOk = () => {
    shouldBlockNavigation.current = false;
    history.push(pathname);
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

  const onFinish = async () => {
    const tagIds = selectedTagNames.map((tagName) => tagIdByTagName[tagName]);
    const thumbnailFile = thumbnail && thumbnail.file.originFileObj;
    const videoFile = video && video.file.originFileObj;

    if (!thumbnailFile) {
      // the validator should prevent this from ever running
      return;
    }
    if (!videoFile) {
      // the validator should prevent this from ever running
      return;
    }

    const res = await $queries.createNotation({
      songName,
      artistName,
      tagIds,
      thumbnail: thumbnailFile,
      video: videoFile,
    });
    if (res.errors) {
      // TODO(jared) add error handling
      console.error(res.errors);
      return;
    }

    const notationId = get(res.data?.createNotation, 'id');
    if (!notationId) {
      // TODO(jared) handle missing notation ids as error
      console.error('no notation id found');
      return;
    }

    shouldBlockNavigation.current = false;
    history.push(`/n/${notationId}/edit`);
  };

  useEffectOnce(() => {
    history.block((location) => {
      if (!shouldBlockNavigation.current) {
        return;
      }
      setPathname(location.pathname);
      setNavigateAwayVisibility(true);
      return false;
    });
  });

  useEffectOnce(() => {
    dispatch(getTags());
  });

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
              <Input placeholder="song name" />
            </HideableFormItem>

            <HideableFormItem
              hasFeedback
              name="artistName"
              hidden={stepNdx !== 2}
              rules={[{ required: true, message: 'artist name required' }]}
            >
              <Input placeholder="artist name" />
            </HideableFormItem>

            <HideableFormItem hidden={stepNdx !== 2}>
              <Select mode="multiple" placeholder="tags" onSelect={onTagSelect} onDeselect={onTagDeselect}>
                {tags.map((tag) => (
                  <Select.Option key={tag.id} value={tag.name}>
                    {tag.name}
                  </Select.Option>
                ))}
              </Select>
            </HideableFormItem>

            <HideableFormItem hidden={stepNdx !== 2}>
              <Button block type="primary" htmlType="submit">
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
