import { UploadOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Divider, Form, Input, InputNumber, Row, Space, Upload } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDevice } from '../../ctx/device';
import { Layout, withLayout } from '../../hocs/withLayout';
import { useNoOverflow } from '../../hooks/useNoOverflow';
import { useNotation } from '../../hooks/useNotation';
import { useNoTouchAction } from '../../hooks/useNoTouchAction';
import { useNoTouchCallout } from '../../hooks/useNoTouchCallout';
import { useNoUserSelect } from '../../hooks/useNoUserSelect';
import { compose } from '../../util/compose';
import { FullHeightDiv } from '../FullHeightDiv';
import { Notation, NotationLayoutOptions } from '../Notation';
import { useUpdatedTimeAgo } from './useUpdatedTimeAgo';

const EPOCH = new Date(1970, 1, 1);

const LAYOUT_OPTIONS: NotationLayoutOptions = {
  permitted: ['sidecar'],
  target: 'sidecar',
};

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

const enhance = compose(withLayout(Layout.NONE));

const NotationEdit: React.FC = enhance(() => {
  const device = useDevice();

  // notation
  const params = useParams<{ id: string }>();
  const [notation, errors, loading] = useNotation(params.id);
  const hasErrors = errors.length > 0;
  const updatedAt = notation ? new Date(notation.updatedAt) : EPOCH;
  const updatedAgo = useUpdatedTimeAgo(updatedAt);

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

  useEffect(() => {
    resetForm();
  }, [form, notation, resetForm]);

  const onValuesChange = (_: any, values: any) => {
    const nextDirty = Object.entries(initialValue).some(([key, val]) => values[key] !== val);
    setDirty(nextDirty);
  };

  // css effects
  useNoOverflow(hasErrors ? null : document.body);
  useNoUserSelect(document.body);
  useNoTouchAction(document.body);
  useNoTouchCallout(document.body);

  return (
    <FullHeightDiv data-testid="notation-edit">
      {device.mobile && (
        <Overlay>
          <h2>Editing is not supported on mobile</h2>
          <Link to={`/n/${params.id}`}>
            <Button type="link">go to notation player</Button>
          </Link>
        </Overlay>
      )}

      {!hasErrors && (
        <Notation
          loading={loading}
          notation={notation}
          sidecar={
            notation && (
              <div>
                <Alert
                  type={dirty ? 'warning' : 'info'}
                  message={<Center>edit mode: {dirty ? 'unsaved changes' : 'no unsaved changes'}</Center>}
                />

                <br />

                <Row justify="space-between">
                  <Link to={`/n/${notation.id}`}>
                    <Button type="link">go to player</Button>
                  </Link>

                  <Space>
                    <Button type="default" onClick={resetForm} disabled={!dirty}>
                      discard
                    </Button>
                    <Button type="primary" disabled={!dirty}>
                      save
                    </Button>
                  </Space>
                </Row>

                <Row justify="end">
                  <Italic>saved {updatedAgo}</Italic>
                </Row>

                <Divider />

                <Form
                  form={form}
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  onValuesChange={onValuesChange}
                  initialValues={initialValue}
                >
                  <Form.Item name="songName" label="song name">
                    <Input />
                  </Form.Item>

                  <Form.Item name="artistName" label="artist">
                    <Input />
                  </Form.Item>

                  <Form.Item name="durationMs" label="duration">
                    <InputNumber />
                  </Form.Item>

                  <Form.Item name="deadTimeMs" label="dead time">
                    <InputNumber />
                  </Form.Item>

                  <Form.Item name="private" wrapperCol={{ offset: 6, span: 18 }}>
                    <Checkbox>private</Checkbox>
                  </Form.Item>

                  <Form.Item name="musicXml" wrapperCol={{ offset: 6, span: 18 }}>
                    <Upload>
                      <Button block icon={<UploadOutlined />}>
                        music xml
                      </Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item name="thumbnail" wrapperCol={{ offset: 6, span: 18 }}>
                    <Upload>
                      <Button block icon={<UploadOutlined />}>
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

      {!loading && hasErrors && (
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
    </FullHeightDiv>
  );
});

export default NotationEdit;
