import { List } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { useViewport } from '../ctx/viewport/useViewport';
import { Layout, withLayout } from '../hocs/withLayout';
import { useNotationPreviews } from '../hooks/useNotationPreviews';
import { compose } from '../util/compose';
import { IntersectionTrigger } from './IntersectionTrigger';
import { NotationCard } from './NotationCard';

const PAGE_SIZE = 9;

const enhance = compose(withLayout(Layout.DEFAULT));

export const Library2: React.FC = enhance(() => {
  const { xs, sm } = useViewport();

  const [notations, pageInfo, loadPage] = useNotationPreviews(PAGE_SIZE);

  return (
    <div data-testid="library">
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
        style={{ padding: xs || sm ? '16px' : 0, border: '1px solid rgba(255,255,255,0)' }}
        dataSource={notations}
        rowKey={(notation) => notation.id}
        renderItem={(notation) => (
          <List.Item>
            <Link to={`/n/${notation.id}`}>
              <NotationCard notation={notation} query={''} isTagChecked={() => true} />
            </Link>
          </List.Item>
        )}
      />
      <IntersectionTrigger onIntersectionEnter={loadPage} />
    </div>
  );
});

export default Library2;
