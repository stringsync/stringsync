import { FormOutlined, PictureOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { compose } from '@stringsync/common';
import { Tag } from '@stringsync/domain';
import { Button, Form, Input, Modal, Select, Steps, Upload as AntdUpload } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { Box } from '../../components/Box';
import { Layout, withLayout } from '../../hocs';
import { useEffectOnce } from '../../hooks';
import { getTags, RootState } from '../../store';

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

interface Props {}

const Upload: React.FC<Props> = enhance(() => {
  const history = useHistory();
  const dispatch = useDispatch();
  const tags = useSelector<RootState, Tag[]>((state) => state.tag.tags);
  const [form] = Form.useForm();
  const [stepNdx, setStepNdx] = useState(0);
  const [isNavigateAwayVisible, setNavigateAwayVisibility] = useState(false);
  const [pathname, setPathname] = useState('');
  const [selectedTagNames, setSelectedTagNames] = useState(new Array<string>());
  const [video, setVideo] = useState<File | Blob | undefined>(undefined);
  const [thumbnail, setThumbnail] = useState<File | Blob | undefined>(undefined);
  const [songName, setSongName] = useState('');
  const [artistName, setArtistName] = useState('');
  const shouldBlockNavigation = useRef(true);
  shouldBlockNavigation.current = selectedTagNames.length > 0 || !!video || !!thumbnail || !!songName || !!artistName;

  const onStepChange = (stepNdx: number) => {
    setStepNdx(stepNdx);
  };

  const onVideoChange = (info: UploadChangeParam) => {
    setVideo(info.file.originFileObj);
  };

  const onVideoRemove = () => {
    setVideo(undefined);
  };

  const onThumbnailChange = (info: UploadChangeParam) => {
    setVideo(info.file.originFileObj);
  };

  const onThumbnailRemove = () => {
    setThumbnail(undefined);
  };

  const onSongNameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setSongName(event.currentTarget.value);
  };

  const onArtistNameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setArtistName(event.currentTarget.value);
  };

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

  const onFinish = async () => {};

  const beforeUpload = () => false;

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
      <Inner>
        <Box>
          <Modal
            title="confirm navigation"
            visible={isNavigateAwayVisible}
            onOk={onConfirmNavigationOk}
            onCancel={onConfirmNavigationCancel}
          >
            <p>are you sure you want to leave?</p>
          </Modal>

          <Steps current={stepNdx} labelPlacement="vertical" onChange={onStepChange}>
            <Step icon={<VideoCameraOutlined />} title="video" />
            <Step icon={<PictureOutlined />} title="thumbnail" />
            <Step icon={<FormOutlined />} title="details" />
          </Steps>

          <br />
          <br />

          <Form form={form} onFinish={onFinish}>
            <HideableFormItem hidden={stepNdx !== 0}>
              <Dragger
                multiple={false}
                listType="picture"
                onChange={onVideoChange}
                onRemove={onVideoRemove}
                beforeUpload={beforeUpload}
              >
                <p className="ant-upload-drag-icon">
                  <VideoCameraOutlined />
                </p>
                <p className="ant-upload-text">drag and drop a video file to upload</p>
                <p className="ant-upload-hint">your video will be private until you publish them</p>
              </Dragger>
            </HideableFormItem>

            <HideableFormItem hidden={stepNdx !== 1}>
              <Dragger
                multiple={false}
                listType="picture"
                onChange={onThumbnailChange}
                onRemove={onThumbnailRemove}
                beforeUpload={beforeUpload}
              >
                <p className="ant-upload-drag-icon">
                  <PictureOutlined />
                </p>
                <p className="ant-upload-text">drag and drop a thumbnail to upload</p>
                <p className="ant-upload-hint">your video will be private until you publish them</p>
              </Dragger>
            </HideableFormItem>

            <HideableFormItem hidden={stepNdx !== 2}>
              <Input placeholder="song name" value={songName} onChange={onSongNameChange} />
            </HideableFormItem>
            <HideableFormItem hidden={stepNdx !== 2}>
              <Input placeholder="artist name" value={artistName} onChange={onArtistNameChange} />
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
