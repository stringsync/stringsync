import { Row, Tag } from 'antd';
import React from 'react';
import { Tag as DomainTag } from '../../domain';

type Props = {
  tags: DomainTag[];
};

export const Tags: React.FC<Props> = (props) => {
  return (
    <Row justify="center" align="middle">
      {props.tags.map((tag) => (
        <Tag key={tag.id}>{tag.name}</Tag>
      ))}
    </Row>
  );
};
