import { compose } from '@stringsync/common';
import { Form, Steps } from 'antd';
import React, { useCallback, useState } from 'react';
import { Box } from '../../components/Box';
import { Layout, withLayout } from '../../hocs';
import styled from 'styled-components';
import { VideoCameraOutlined, PictureOutlined, FormOutlined } from '@ant-design/icons';

const { Step } = Steps;

const Outer = styled.div`
  margin-top: 24px;
`;

const Inner = styled.div`
  margin: 0 auto;
  max-width: 720px;
`;

const enhance = compose(withLayout(Layout.DEFAULT));

interface Props {}

const Upload: React.FC<Props> = enhance(() => {
  const [stepNdx, setStepNdx] = useState(0);
  const [form] = Form.useForm();

  const onStepChange = useCallback((stepNdx: number) => {
    setStepNdx(stepNdx);
  }, []);

  return (
    <Outer data-testid="upload">
      <Inner>
        <Box>
          <Steps current={stepNdx} labelPlacement="vertical" onChange={onStepChange}>
            <Step icon={<VideoCameraOutlined />} title="video" />
            <Step icon={<PictureOutlined />} title="thumbnail" />
            <Step icon={<FormOutlined />} title="details" />
          </Steps>
        </Box>
      </Inner>
    </Outer>
  );
});

export default Upload;
