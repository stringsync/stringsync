import { UploadOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Divider, Form, Input, InputNumber, Row, Space, Upload } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { RcFile } from 'antd/lib/upload';
import { get } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDevice } from '../../ctx/device';
import { useViewport } from '../../ctx/viewport/useViewport';
import { Layout, withLayout } from '../../hocs/withLayout';
import { HEADER_HEIGHT_PX } from '../../hocs/withLayout/DefaultLayout';
import { useNoOverflow } from '../../hooks/useNoOverflow';
import { useNoTouchAction } from '../../hooks/useNoTouchAction';
import { useNoTouchCallout } from '../../hooks/useNoTouchCallout';
import { useNoUserSelect } from '../../hooks/useNoUserSelect';
import { useTimeAgo } from '../../hooks/useTimeAgo';
import { compose } from '../../util/compose';
import { Notation, NotationLayoutOptions } from '../Notation';
import { useNotationEditApi } from './useNotationEditApi';

const LAYOUT_OPTIONS: NotationLayoutOptions = {
  permitted: ['sidecar'],
  target: 'sidecar',
};

const Outer = styled.div`
  background-color: white;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
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

const NotationEdit: React.FC = enhance(() => {
  const device = useDevice();
  const viewport = useViewport();
  const notationMaxHeight = viewport.innerHeight - HEADER_HEIGHT_PX;

  // notation
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { notation, errors, getLoading, updateLoading, getNotation, updateNotation } = useNotationEditApi();
  const loading = getLoading || updateLoading;
  const hasErrors = errors.length > 0;
  const updatedAgo = useTimeAgo(notation?.updatedAt || null);
  useEffect(() => {
    getNotation({ id });
  }, [getNotation, id]);

  // form
  const [form] = useForm();
  const [dirty, setDirty] = useState(false);
  const initialValue = {
    songName: notation?.songName,
    artistName: notation?.artistName,
    durationMs: notation?.durationMs,
    deadTimeMs: notation?.deadTimeMs,
    private: notation?.private,
  };
  const resetForm = useCallback(() => {
    form.resetFields();
    setDirty(false);
  }, [form]);
  const onSaveClick = useCallback(() => {
    const values = form.getFieldsValue(true);
    updateNotation({
      input: {
        id,
        artistName: values.artistName,
        songName: values.songName,
        deadTimeMs: values.deadTimeMs,
        durationMs: values.durationMs,
        private: values.private,
        thumbnail: get(values, 'thumbnail.file', null),
        musicXml: get(values, 'musicXml.file', null),
      },
    });
  }, [form, id, updateNotation]);
  const dontUpload = (file: RcFile) => false;

  useEffect(() => {
    resetForm();
  }, [form, notation, resetForm]);

  const onValuesChange = (_: any, values: any) => {
    const nextDirty =
      Object.entries(initialValue).some(([key, val]) => values[key] !== val) || values.thumbnail || values.musicXml;
    setDirty(nextDirty);
  };

  // css effects
  useNoOverflow(hasErrors ? null : document.body);
  useNoUserSelect(document.body);
  useNoTouchAction(document.body);
  useNoTouchCallout(document.body);

  return (
    <Outer data-testid="notation-edit">
      {device.mobile && (
        <Overlay>
          <h2>Editing is not supported on mobile</h2>
          <Link to={`/n/${id}`}>
            <Button type="link">go to notation player</Button>
          </Link>
        </Overlay>
      )}

      {notation && (
        <Notation
          skeleton={getLoading}
          notation={notation}
          maxHeight={notationMaxHeight}
          sidecar={
            notation && (
              <div>
                <Alert
                  type={dirty ? 'warning' : 'success'}
                  message={<Center>edit mode: {dirty ? 'unsaved changes' : 'up-to-date'}</Center>}
                />

                <br />

                <Row justify="space-between">
                  <Link to={`/n/${notation.id}`}>
                    <Button type="link">go to player</Button>
                  </Link>

                  <Space>
                    <Button type="default" onClick={resetForm} disabled={!dirty || loading}>
                      discard
                    </Button>
                    <Button type="primary" onClick={onSaveClick} disabled={!dirty || loading}>
                      save
                    </Button>
                  </Space>
                </Row>

                <Row justify="end">
                  <Italic>saved {updatedAgo}</Italic>
                </Row>

                <Divider />

                {hasErrors && (
                  <ErrorsOuter>
                    <Row justify="center">
                      <Alert
                        showIcon
                        type="error"
                        message="error"
                        description={
                          <>
                            {errors.map((error, ndx) => (
                              <div key={ndx}>{error}</div>
                            ))}
                          </>
                        }
                      />
                    </Row>
                  </ErrorsOuter>
                )}

                <Form
                  form={form}
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  onValuesChange={onValuesChange}
                  initialValues={initialValue}
                >
                  <Form.Item name="songName" label="song name">
                    <Input disabled={loading} />
                  </Form.Item>

                  <Form.Item name="artistName" label="artist">
                    <Input disabled={loading} />
                  </Form.Item>

                  <Form.Item name="durationMs" label="duration">
                    <InputNumber disabled={loading} />
                  </Form.Item>

                  <Form.Item name="deadTimeMs" label="dead time">
                    <InputNumber disabled={loading} />
                  </Form.Item>

                  <Form.Item name="private" valuePropName="checked" wrapperCol={{ offset: 6, span: 18 }}>
                    <Checkbox disabled={loading}>private</Checkbox>
                  </Form.Item>

                  <Form.Item name="musicXml" wrapperCol={{ offset: 6, span: 18 }}>
                    <Upload beforeUpload={dontUpload}>
                      <Button block disabled={loading} icon={<UploadOutlined />}>
                        music xml
                      </Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item name="thumbnail" wrapperCol={{ offset: 6, span: 18 }}>
                    <Upload beforeUpload={dontUpload}>
                      <Button block disabled={loading} icon={<UploadOutlined />}>
                        thumbnail
                      </Button>
                    </Upload>
                  </Form.Item>
                </Form>
              </div>
            )
          }
          layoutOptions={LAYOUT_OPTIONS}
        />
      )}
    </Outer>
  );
});

export default NotationEdit;
