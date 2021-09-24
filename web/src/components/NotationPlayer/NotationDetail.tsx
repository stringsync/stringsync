import { FileImageOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';
import styled from 'styled-components';

const DetailImg = styled.img`
  width: 36px;
  height: 36px;
`;

const MissingImgIcon = styled(FileImageOutlined)`
  font-size: 2em;
  color: ${(props) => props.theme['@muted']};
`;

type Props = {
  thumbnailUrl: string;
  songName: string;
  artistName: string;
};

export const NotationDetail: React.FC<Props> = (props) => {
  return props.thumbnailUrl ? (
    <Tooltip title={`${props.songName} by ${props.artistName}`}>
      <DetailImg src={props.thumbnailUrl} alt="notation detail image" />
    </Tooltip>
  ) : (
    <Tooltip title={`${props.songName} by ${props.artistName}`}>
      <MissingImgIcon />
    </Tooltip>
  );
};
