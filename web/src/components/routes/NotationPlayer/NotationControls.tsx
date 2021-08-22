import { PauseCircleOutlined, PlayCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Col, Row, Slider } from 'antd';
import styled from 'styled-components';

const Outer = styled.div`
  bottom: 0;
  z-index: 3;
  background: white;
  border-top: 1px solid ${(props) => props.theme['@border-color']};
  padding: 24px 16px;
  position: absolute;
  width: 100%;
`;

const PlayIcon = styled(PlayCircleOutlined)`
  font-size: 2em;
  cursor: pointer;
  color: ${(props) => props.theme['@muted']};
`;

const PauseIcon = styled(PauseCircleOutlined)`
  font-size: 2em;
`;

const SettingsIcon = styled(SettingOutlined)`
  font-size: 2em;
  cursor: pointer;
  color: ${(props) => props.theme['@muted']};
`;

export const NotationControls = () => {
  return (
    <Outer>
      <Row justify="center" align="middle" gutter={8}>
        <Col span={1}>
          <PlayIcon />
        </Col>
        <Col xxl={18} xl={18} lg={22} md={22} sm={22} xs={22}>
          <Slider />
        </Col>
        <Col span={1}>
          <SettingsIcon />
        </Col>
        <Col xxl={4} xl={4} lg={0} md={0} sm={0} xs={0}>
          detail
        </Col>
      </Row>
    </Outer>
  );
};
