import { Button, Row } from 'antd';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Layout, withLayout } from '../hocs/withLayout';
import { compose } from '../util/compose';
import { Box } from './Box';

const Outer = styled.div`
  margin-top: 48px;
`;

const Inner = styled.div`
  margin: 0 auto;
  max-width: 720px;
`;

type FormValues = {};

const enhance = compose(withLayout(Layout.DEFAULT));

export const NExport: React.FC = enhance(() => {
  const params = useParams();
  const notationId = params.id || '';

  return (
    <Outer data-testid="n-export">
      <Inner>
        <Box>
          <Row justify="space-between">
            <Link to={`/n/${notationId}`}>
              <Button type="link">go to player</Button>
            </Link>
          </Row>
        </Box>
      </Inner>
    </Outer>
  );
});

export default NExport;
