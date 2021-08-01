import React from 'react';
import { useParams } from 'react-router';
import { Layout, withLayout } from '../../../hocs';
import { compose } from '../../../util/compose';
import { Video } from '../../Video';

const enhance = compose(withLayout(Layout.DEFAULT));

interface Props {}

const NotationPlayer: React.FC<Props> = enhance(() => {
  const params = useParams<{ id: string }>();

  return (
    <div>
      {params.id}
      <hr />
      <Video
        playerOptions={{
          sources: [
            {
              src: 'https://d2w1rk200g2ur4.cloudfront.net/79b928a4-fcf6-412e-a96f-f251e7e14c4f/hls/z3HrPy8P.m3u8',
              type: 'application/x-mpegURL',
            },
          ],
        }}
      />
    </div>
  );
});

export default NotationPlayer;
