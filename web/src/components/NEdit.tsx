import { UploadOutlined } from '@ant-design/icons';
import { Button, Checkbox, Input, InputNumber, Row, Space } from 'antd';
import Form, { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Upload, { RcFile } from 'antd/lib/upload';
import { get } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Layout, withLayout } from '../hocs/withLayout';
import { useNoOverflow } from '../hooks/useNoOverflow';
import { useNotationEditor } from '../hooks/useNotationEditor';
import { useNoTouchAction } from '../hooks/useNoTouchAction';
import { useNoTouchCallout } from '../hooks/useNoTouchCallout';
import { useNoUserSelect } from '../hooks/useNoUserSelect';
import { useTimeAgo } from '../hooks/useTimeAgo';
import { compose } from '../util/compose';
import { Errors } from './Errors';
import { FullHeightDiv } from './FullHeightDiv';

const Outer = styled(FullHeightDiv)`
  background: white;
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

const enhance = compose(withLayout(Layout.DEFAULT, { footer: false, lanes: false }));

export const NEdit: React.FC = enhance(() => {
  // notation
  const params = useParams();
  const notationId = params.id || '';
  const editor = useNotationEditor();
  const updatedAgo = useTimeAgo(editor.notation?.updatedAt || null);

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
  const initialValue = {
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
  const dontUpload = (file: RcFile) => false;
  useEffect(() => {
    resetForm();
  }, [form, editor.notation, resetForm]);
  const onValuesChange = (_: any, values: any) => {
    const nextDirty =
      Object.entries(initialValue).some(([key, val]) => values[key] !== val) || values.thumbnail || values.musicXml;
    setDirty(nextDirty);
  };

  // css effects
  useNoOverflow(editor.fetchNotationErrors.length > 0 ? null : document.body);
  useNoUserSelect(document.body);
  useNoTouchAction(document.body);
  useNoTouchCallout(document.body);

  // render branches
  const showFetchNotationErrors = !editor.fetching && editor.fetchNotationErrors.length > 0;
  const showUpdateNotationErrors = !editor.updating && editor.updateNotationErrors.length > 0;
  const showNotationEditor = !editor.fetching && !!editor.notation;

  return (
    <Outer data-testid="n-edit">
      {showFetchNotationErrors && (
        <ErrorsOuter>
          <Errors errors={editor.fetchNotationErrors} />
        </ErrorsOuter>
      )}

      {showUpdateNotationErrors && (
        <ErrorsOuter>
          <Errors errors={editor.updateNotationErrors} />
        </ErrorsOuter>
      )}

      {showNotationEditor && (
        <>
          <Row justify="space-between">
            <Link to={`/n/${notationId}`}>
              <Button type="link">go to player</Button>
            </Link>

            <Space>
              <Button type="default" onClick={resetForm} disabled={!dirty || editor.updating}>
                discard
              </Button>
              <Button type="primary" onClick={onSaveClick} disabled={!dirty || editor.updating}>
                save
              </Button>
            </Space>
          </Row>

          <Row justify="end">
            <Italic>saved {updatedAgo}</Italic>
          </Row>

          <Form
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onValuesChange={onValuesChange}
            initialValues={initialValue}
          >
            <FormItem name="songName" label="song name">
              <Input disabled={editor.fetching} />
            </FormItem>

            <FormItem name="artistName" label="artist">
              <Input disabled={editor.fetching} />
            </FormItem>

            <FormItem name="durationMs" label="duration">
              <InputNumber disabled={editor.fetching} />
            </FormItem>

            <FormItem name="deadTimeMs" label="dead time">
              <InputNumber disabled={editor.fetching} />
            </FormItem>

            <FormItem name="private" valuePropName="checked" wrapperCol={{ offset: 6, span: 18 }}>
              <Checkbox disabled={editor.fetching}>private</Checkbox>
            </FormItem>

            <FormItem name="musicXml" wrapperCol={{ offset: 6, span: 18 }}>
              <Upload beforeUpload={dontUpload}>
                <Button block disabled={editor.fetching} icon={<UploadOutlined />}>
                  music xml
                </Button>
              </Upload>
            </FormItem>

            <FormItem name="thumbnail" wrapperCol={{ offset: 6, span: 18 }}>
              <Upload beforeUpload={dontUpload}>
                <Button block disabled={editor.fetching} icon={<UploadOutlined />}>
                  thumbnail
                </Button>
              </Upload>
            </FormItem>
          </Form>
        </>
      )}
    </Outer>
  );
});

export default NEdit;
