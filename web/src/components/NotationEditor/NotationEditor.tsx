import React from 'react';
import { useParams } from 'react-router';
import { Layout, withLayout } from '../../hocs/withLayout';
import { useNotation } from '../../hooks/useNotation';
import { compose } from '../../util/compose';
import { Video } from '../Video';

const enhance = compose(withLayout(Layout.DEFAULT));

const NotationEditor: React.FC = enhance(() => {
  const params = useParams<{ id: string }>();

  const [notation, errors, isLoading] = useNotation(params.id);

  return (
    <div>
      <br />
      <br />
      <div>edit {params.id}</div>
      <hr />
      {!isLoading && notation && notation.videoUrl && (
        <Video
          playerOptions={{
            sources: [
              {
                src: notation.videoUrl,
                type: 'application/x-mpegURL',
              },
            ],
          }}
        />
      )}
    </div>
  );
});

export default NotationEditor;
