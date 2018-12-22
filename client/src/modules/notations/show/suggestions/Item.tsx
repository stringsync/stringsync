import * as React from 'react';
import { INotation } from '../../../../@types/notation';
import styled from 'react-emotion';
import { Row, Col, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { get, truncate } from 'lodash';

interface IProps {
  notation: INotation;
  focusedNotation: INotation;
}

const Outer = styled('li')<{ selected: boolean }>`
  padding-top: 8px;
  padding-bottom: 8px;
  margin-left: 8px;
  margin-right: 8px;
  border-bottom: 1px solid #e8e8e8;
  ${props => props.selected ? 'opacity: 0.5;' : ''}
`;

const Img = styled('img')`
  width: 100%;
`;

const TranscriberName = styled('div')`
  font-size: 1em;
  color: #aaa;
`;

export const Item: React.SFC<IProps> = ({ notation, focusedNotation }) => (
  <Outer selected={notation.id === focusedNotation.id}>
    <Link to={`/n/${notation.id}`} style={{ color: 'black' }}>
      <Row type="flex" justify="center" gutter={8}>
        <Col span={6}>
          <Img src={notation.thumbnailUrl} alt={notation.songName} />
        </Col>
        <Col span={18}>
          <div><b>{truncate(notation.songName, { length: 30 })}</b></div>
          <div>by {truncate(notation.artistName, { length: 30 })}</div>
          <TranscriberName>
            {truncate(get(notation.transcriber, 'name', ''), { length: 30 })}
          </TranscriberName>
          {notation.tags.map(tag => (
            <Tag
              key={tag}
              color={focusedNotation.tags.includes(tag) ? '#FC354C' : undefined}
            >
              {tag}
            </Tag>
          ))}
        </Col>
      </Row>
    </Link>
  </Outer>
);
