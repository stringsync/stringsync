import { UploadOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Divider, Form, InputNumber, Row, Space, Upload } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { RenderableNotation } from '../Notation';

const Center = styled.div`
  text-align: center;
`;

const Italic = styled.div`
  margin-top: 4px;
  font-style: italic;
  font-size: 0.75em;
`;

type Props = {
  notation: RenderableNotation;
  onNotationUpdate(notation: RenderableNotation): void;
};

export const EditSettings: React.FC<Props> = (props) => (
  <div>
    <Alert type="warning" message={<Center>edit mode</Center>} />

    <br />

    <Row justify="space-between">
      <Link to={`/n/${props.notation.id}`}>
        <Button type="link">go to player</Button>
      </Link>

      <Space>
        <Button type="default">discard</Button>
        <Button type="primary">save</Button>
      </Space>
    </Row>

    <Row justify="end">
      <Italic>saved 0 minutes ago</Italic>
    </Row>

    <Divider />

    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
      <Form.Item label="duration">
        <InputNumber />
      </Form.Item>

      <Form.Item label="dead time">
        <InputNumber />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>private</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Upload>
          <Button block icon={<UploadOutlined />}>
            upload xml
          </Button>
        </Upload>
      </Form.Item>
    </Form>
  </div>
);
