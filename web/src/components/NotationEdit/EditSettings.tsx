import { Alert, Button, Checkbox, Col, Divider, InputNumber, Row, Space } from 'antd';
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

    <Row gutter={8} align="bottom">
      <Col span={6}>
        <h5>duration ms</h5>
        <InputNumber min={1} max={20} />
      </Col>
      <Col span={6}>
        <h5>dead time ms</h5>
        <InputNumber min={1} max={20} />
      </Col>
      <Col span={6}>
        <Checkbox>private</Checkbox>
      </Col>
    </Row>
  </div>
);
