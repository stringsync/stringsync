import { Skeleton } from 'antd';
import styled from 'styled-components';

const Outer = styled.div`
  display: flex;
  width: 100%;
`;

const SkeletonOuter = styled.div`
  width: 100%;

  .ant-skeleton {
    width: 100%;
    height: 100%;
  }
`;

type Props = {
  loading: boolean;
};

export const Media: React.FC<Props> = (props) => {
  return (
    <Outer data-testid="media">
      {props.loading && (
        <SkeletonOuter>
          <Skeleton.Image style={{ width: '100%', height: '100%' }} />
        </SkeletonOuter>
      )}

      {!props.loading && <div>media</div>}
    </Outer>
  );
};
