import { Button, Divider, Form, InputNumber, Row } from 'antd';
import CheckableTag from 'antd/lib/tag/CheckableTag';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Layout, withLayout } from '../hocs/withLayout';
import { useNotation } from '../hooks/useNotation';
import { compose } from '../util/compose';
import { Box } from './Box';
import { Errors } from './Errors';
import { NotationInfo } from './NotationInfo';

const Outer = styled.div`
  margin-top: 48px;
`;

const Inner = styled.div`
  margin: 0 auto;
  max-width: 720px;
  padding: 24px;
`;

const FormOuter = styled.div`
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
`;

const PRESETS = [
  { name: 'instagram', width: 1080, height: 1920 },
  { name: 'tiktok', width: 1080, height: 1920 },
  { name: 'facebook', width: 1280, height: 720 },
  { name: 'youtube', width: 1920, height: 1080 },
] as const;

const enhance = compose(withLayout(Layout.DEFAULT));

export const NExport: React.FC = enhance(() => {
  // notation
  const params = useParams();
  const notationId = params.id || '';
  const [notation, errors, loading] = useNotation(notationId);

  // form
  const [width, setWidth] = useState<number>(PRESETS[0].width);
  const [height, setHeight] = useState<number>(PRESETS[0].height);

  // render branches
  const renderNotationErrors = errors.length > 0;
  const renderForm = !loading && !!notation;
  const renderEditButton = !loading && errors.length === 0;
  const renderPlayerButton = !loading && errors.length === 0;

  return (
    <Outer data-testid="n-export">
      <Inner>
        {!loading && (
          <Box>
            {renderNotationErrors && <Errors errors={errors} />}

            {renderForm && (
              <FormOuter>
                <NotationInfo notation={notation} />

                <br />
                <br />

                <Row justify="center">
                  {PRESETS.map((preset) => (
                    <CheckableTag
                      key={preset.name}
                      checked={preset.width === width && preset.height === height}
                      onClick={() => {
                        setWidth(preset.width);
                        setHeight(preset.height);
                      }}
                    >
                      {preset.name}
                    </CheckableTag>
                  ))}
                </Row>

                <Divider />

                <Row justify="center">
                  <Form layout="inline">
                    <Form.Item label="width">
                      <InputNumber min={200} max={2560} value={width} onChange={setWidth} />
                    </Form.Item>

                    <Form.Item label="height">
                      <InputNumber min={200} max={2560} value={height} onChange={setHeight} />
                    </Form.Item>
                  </Form>
                </Row>

                <br />

                <Row justify="center">
                  <Button block type="primary" htmlType="submit">
                    export
                  </Button>
                </Row>
              </FormOuter>
            )}

            <br />

            <Row justify="center">
              {renderEditButton && (
                <Link to={`/n/${notationId}/edit`}>
                  <Button block type="link">
                    edit
                  </Button>
                </Link>
              )}

              {renderPlayerButton && (
                <Link to={`/n/${notationId}`}>
                  <Button block type="link">
                    player
                  </Button>
                </Link>
              )}

              <Link to="/library">
                <Button block type="link">
                  library
                </Button>
              </Link>
            </Row>
          </Box>
        )}
      </Inner>
    </Outer>
  );
});

export default NExport;
