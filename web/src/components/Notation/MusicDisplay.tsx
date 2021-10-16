import { Skeleton } from 'antd';
import styled from 'styled-components';

const SkeletonContainer = styled.div`
  padding: 64px;
`;

type Props = {
  loading: boolean;
};

export const MusicDisplay: React.FC<Props> = (props) => {
  const loading = props.loading;

  return (
    <div data-testid="music-display">
      {loading && (
        <SkeletonContainer>
          <Skeleton loading title={false} paragraph={{ rows: 3 }} />
          <br />
          <br />
          <Skeleton loading title={false} paragraph={{ rows: 3 }} />
          <br />
          <br />
          <Skeleton loading title={false} paragraph={{ rows: 3 }} />
          <br />
          <br />
          <Skeleton loading title={false} paragraph={{ rows: 3 }} />
          <br />
          <br />
          <Skeleton loading title={false} paragraph={{ rows: 3 }} />
          <br />
          <br />
          <Skeleton loading title={false} paragraph={{ rows: 3 }} />
        </SkeletonContainer>
      )}

      {!loading && <></>}
    </div>
  );
};
