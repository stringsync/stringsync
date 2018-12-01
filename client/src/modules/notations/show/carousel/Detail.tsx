import * as React from 'react';
import { INotation } from '../../../../@types/notation';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';

interface IProps {
  notation: INotation;
}

const StyledImg = styled('img')`
  width: 100px;
  padding-top: 8px;
  padding-bottom: 8px;
`;

export const Detail: React.SFC<IProps> = props => (
  <Tooltip title={`${props.notation.songName} by ${props.notation.artistName}`}>
    <Link to={`/n/${props.notation.id}`}>
      <StyledImg src={props.notation.thumbnailUrl} alt={props.notation.songName} />
    </Link>
  </Tooltip>
);
