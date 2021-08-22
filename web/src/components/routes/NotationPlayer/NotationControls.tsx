import { FileImageOutlined, PauseCircleOutlined, PlayCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Col, Row, Slider, Tooltip } from 'antd';
import { useCallback, useMemo } from 'react';
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

const DetailImg = styled.img`
  width: 36px;
  height: 36px;
`;

const MissingImgIcon = styled(FileImageOutlined)`
  font-size: 2em;
  color: ${(props) => props.theme['@muted']};
`;

export type Props = {
  currentTimeMs: number;
  durationMs: number;
  songName: string;
  artistName: string;
  thumbnailUrl: string;
  onCurrentTimeMsChange: (currentTimeMs: number) => void;
};

export const NotationControls: React.FC<Props> = (props) => {
  const value = props.durationMs === 0 ? 0 : (props.currentTimeMs / props.durationMs) * 100;

  const Detail = useMemo(
    () => () => {
      return props.thumbnailUrl ? (
        <Tooltip title={`${props.songName} by ${props.artistName}`}>
          <DetailImg src={props.thumbnailUrl} alt="notation detail image" />
        </Tooltip>
      ) : (
        <Row align="middle">
          <Tooltip title={`${props.songName} by ${props.artistName}`}>
            <MissingImgIcon />
          </Tooltip>
        </Row>
      );
    },
    [props.songName, props.artistName, props.thumbnailUrl]
  );

  const { durationMs, onCurrentTimeMsChange } = props;
  const onChange = useCallback(
    (value: number) => {
      const currentTimeMs = (value / 100) * durationMs;
      onCurrentTimeMsChange(currentTimeMs);
    },
    [durationMs, onCurrentTimeMsChange]
  );

  return (
    <Outer>
      <Row justify="center" align="middle" gutter={8}>
        <Col span={1}>
          <PlayIcon />
        </Col>
        <Col xxl={18} xl={18} lg={22} md={22} sm={22} xs={22}>
          <Slider step={0.01} value={value} onChange={onChange} />
        </Col>
        <Col span={1}>
          <SettingsIcon />
        </Col>
        <Col xxl={4} xl={4} lg={0} md={0} sm={0} xs={0}>
          <Detail />
        </Col>
      </Row>
    </Outer>
  );
};
