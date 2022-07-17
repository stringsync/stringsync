import { HomeOutlined, InfoCircleOutlined, SoundFilled, SoundOutlined, UploadOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Drawer, Form, Input, InputNumber, Row, Space } from 'antd';
import { FormInstance, useForm } from 'antd/lib/form/Form';
import Upload, { RcFile } from 'antd/lib/upload';
import { get } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Layout, withLayout } from '../hocs/withLayout';
import { useMute } from '../hooks/useMute';
import { useNoOverflow } from '../hooks/useNoOverflow';
import { NotationEditor, useNotationEditor } from '../hooks/useNotationEditor';
import { useNotationSettings } from '../hooks/useNotationSettings';
import { useNoTouchAction } from '../hooks/useNoTouchAction';
import { useNoTouchCallout } from '../hooks/useNoTouchCallout';
import { useNoUserSelect } from '../hooks/useNoUserSelect';
import { useTimeAgo } from '../hooks/useTimeAgo';
import { MediaPlayer, NoopMediaPlayer } from '../lib/MediaPlayer';
import { compose } from '../util/compose';
import { Errors } from './Errors';
import { FullHeightDiv } from './FullHeightDiv';
import { NotationInfo } from './NotationInfo';
import { NotationPlayer } from './NotationPlayer';
import { SplitPaneLayoutType } from './SplitPaneLayout';

const Outer = styled(FullHeightDiv)`
  background: white;
`;

const SidecarOuter = styled.div`
  margin: 16px;
`;

const FloatingButton = styled(Button)<{ $top: number }>`
  position: fixed;
  top: ${(props) => props.$top}px;
  right: -1px;
  z-index: 6;
`;

const ErrorsOuter = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 24px;
`;

const Center = styled.div`
  text-align: center;
`;

const Italic = styled.div`
  margin-top: 4px;
  font-style: italic;
  font-size: 0.75em;
`;

const Sidecar: React.FC<{
  editor: NotationEditor;
  dirty: boolean;
  notationId: string;
  form: FormInstance;
  initialValues: any;
  resetForm: () => void;
  onSaveClick: () => void;
  onValuesChange: (changedValues: any, values: any) => void;
}> = (props) => {
  const updatedAgo = useTimeAgo(props.editor.notation?.updatedAt || null);
  const dontUpload = (file: RcFile) => false;

  return (
    <SidecarOuter>
      <NotationInfo notation={props.editor.notation} />

      <br />

      <Alert
        type={props.dirty ? 'warning' : 'success'}
        message={<Center>edit mode: {props.dirty ? 'unsaved changes' : 'up-to-date'}</Center>}
      />

      <br />

      <Row justify="space-between">
        <Link to={`/n/${props.notationId}`}>
          <Button type="link">go to player</Button>
        </Link>

        <Space>
          <Button type="default" onClick={props.resetForm} disabled={!props.dirty || props.editor.updating}>
            discard
          </Button>
          <Button type="primary" onClick={props.onSaveClick} disabled={!props.dirty || props.editor.updating}>
            save
          </Button>
        </Space>
      </Row>

      <Row justify="end">
        <Italic>saved {updatedAgo}</Italic>
      </Row>

      <br />

      <Form
        form={props.form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onValuesChange={props.onValuesChange}
        initialValues={props.initialValues}
      >
        <Form.Item name="songName" label="song name">
          <Input disabled={props.editor.fetching} />
        </Form.Item>

        <Form.Item name="artistName" label="artist">
          <Input disabled={props.editor.fetching} />
        </Form.Item>

        <Form.Item name="durationMs" label="duration">
          <InputNumber disabled={props.editor.fetching} />
        </Form.Item>

        <Form.Item name="deadTimeMs" label="dead time">
          <InputNumber disabled={props.editor.fetching} />
        </Form.Item>

        <Form.Item name="private" valuePropName="checked" wrapperCol={{ offset: 6, span: 18 }}>
          <Checkbox disabled={props.editor.fetching}>private</Checkbox>
        </Form.Item>

        <Form.Item name="musicXml" wrapperCol={{ offset: 6, span: 18 }}>
          <Upload beforeUpload={dontUpload}>
            <Button block disabled={props.editor.fetching} icon={<UploadOutlined />}>
              music xml
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item name="thumbnail" wrapperCol={{ offset: 6, span: 18 }}>
          <Upload beforeUpload={dontUpload}>
            <Button block disabled={props.editor.fetching} icon={<UploadOutlined />}>
              thumbnail
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </SidecarOuter>
  );
};

const enhance = compose(withLayout(Layout.NONE, { footer: false, lanes: false }));

export const NEdit: React.FC = enhance(() => {
  // notation
  const params = useParams();
  const notationId = params.id || '';
  const editor = useNotationEditor();

  // settings
  const [notationSettings, setNotationSettings] = useNotationSettings();

  // automatically fetch whenever the notationId changes
  useEffect(() => {
    if (!notationId) {
      return;
    }
    if (editor.fetchNotationErrors.length) {
      return;
    }
    if (editor.notation?.id === notationId) {
      return;
    }
    if (editor.fetching || editor.updating) {
      return;
    }
    editor.fetchNotation({ id: notationId });
  }, [editor, notationId]);

  // form
  const [form] = useForm();
  const [dirty, setDirty] = useState(false);
  const initialValues = {
    songName: editor.notation?.songName,
    artistName: editor.notation?.artistName,
    durationMs: editor.notation?.durationMs,
    deadTimeMs: editor.notation?.deadTimeMs,
    private: editor.notation?.private,
  };
  const resetForm = useCallback(() => {
    form.resetFields();
    setDirty(false);
  }, [form]);
  const onSaveClick = useCallback(() => {
    if (!notationId) {
      return;
    }
    const values = form.getFieldsValue(true);
    editor.updateNotation({
      input: {
        id: notationId,
        artistName: values.artistName,
        songName: values.songName,
        deadTimeMs: values.deadTimeMs,
        durationMs: values.durationMs,
        private: values.private,
        thumbnail: get(values, 'thumbnail.file', null),
        musicXml: get(values, 'musicXml.file', null),
      },
    });
  }, [form, notationId, editor]);
  useEffect(() => {
    resetForm();
  }, [form, editor.notation, resetForm]);
  const onValuesChange = (_: any, values: any) => {
    const nextDirty =
      Object.entries(initialValues).some(([key, val]) => values[key] !== val) || values.thumbnail || values.musicXml;
    setDirty(nextDirty);
  };

  // layout
  const [layoutType, setLayoutType] = useState<SplitPaneLayoutType>('sidecar');

  // navigation
  const navigate = useNavigate();
  const onHomeClick = () => navigate('/library');

  // mute
  const [mediaPlayer, setMediaPlayer] = useState<MediaPlayer>(() => new NoopMediaPlayer());
  const [muted, toggleMute] = useMute(mediaPlayer);

  // sidecar drawer
  const [isSidecarDrawerVisible, setSidecarDrawerVisibility] = useState(false);
  const onSidecarDrawerToggle = () => setSidecarDrawerVisibility((isSidecarDrawerVisible) => !isSidecarDrawerVisible);
  const onSidecarDrawerClose = () => setSidecarDrawerVisibility(false);
  useEffect(() => {
    if (layoutType !== 'theater') {
      setSidecarDrawerVisibility(false);
    }
  }, [layoutType]);

  // css effects
  useNoOverflow(editor.fetchNotationErrors.length > 0 ? null : document.body);
  useNoUserSelect(document.body);
  useNoTouchAction(document.body);
  useNoTouchCallout(document.body);

  // render branches
  const renderFetchNotationErrors = !editor.fetching && editor.fetchNotationErrors.length > 0;
  const renderUpdateNotationErrors = !editor.updating && editor.updateNotationErrors.length > 0;
  const renderNotationEditor = !editor.fetching && !!editor.notation;
  const renderDrawer = layoutType === 'theater';
  const renderFloatingButtons = layoutType === 'theater';

  return (
    <Outer data-testid="n-edit">
      {renderFetchNotationErrors && (
        <ErrorsOuter>
          <Errors errors={editor.fetchNotationErrors} />
        </ErrorsOuter>
      )}

      {renderUpdateNotationErrors && (
        <ErrorsOuter>
          <Errors errors={editor.updateNotationErrors} />
        </ErrorsOuter>
      )}

      {renderDrawer && (
        <Drawer
          closable
          visible={isSidecarDrawerVisible}
          mask={false}
          width="100%"
          onClose={onSidecarDrawerClose}
          getContainer={false}
        >
          <Sidecar
            dirty={dirty}
            editor={editor}
            form={form}
            initialValues={initialValues}
            notationId={notationId}
            onSaveClick={onSaveClick}
            onValuesChange={onValuesChange}
            resetForm={resetForm}
          />
        </Drawer>
      )}

      {renderNotationEditor && (
        <NotationPlayer
          notation={editor.notation}
          notationSettings={notationSettings}
          setNotationSettings={setNotationSettings}
          onLayoutTypeChange={setLayoutType}
          onMediaPlayerChange={setMediaPlayer}
          sidecar={
            <Sidecar
              dirty={dirty}
              editor={editor}
              form={form}
              initialValues={initialValues}
              notationId={notationId}
              onSaveClick={onSaveClick}
              onValuesChange={onValuesChange}
              resetForm={resetForm}
            />
          }
        />
      )}

      {renderFloatingButtons && (
        <>
          <FloatingButton $top={16} size="large" type="primary" icon={<HomeOutlined />} onClick={onHomeClick} />
          <FloatingButton
            $top={72}
            size="large"
            type="primary"
            icon={<InfoCircleOutlined />}
            onClick={onSidecarDrawerToggle}
          />
          <FloatingButton
            $top={128}
            size="large"
            type="primary"
            icon={muted ? <SoundOutlined /> : <SoundFilled />}
            onClick={toggleMute}
          />
        </>
      )}
    </Outer>
  );
});

export default NEdit;
