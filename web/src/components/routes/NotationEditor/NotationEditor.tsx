import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Notation } from '../../../domain';
import { $queries, NotationObject } from '../../../graphql';
import { Layout, withLayout } from '../../../hocs';
import { useEffectOnce } from '../../../hooks';
import { compose } from '../../../util/compose';

const enhance = compose(withLayout(Layout.DEFAULT));

const toNotation = (notationObj: NotationObject): Notation => ({
  id: notationObj.id,
  artistName: notationObj.artistName || '',
  createdAt: notationObj.createdAt,
  deadTimeMs: notationObj.deadTimeMs,
  durationMs: notationObj.durationMs,
  private: notationObj.private,
  songName: notationObj.songName || '',
  thumbnailUrl: notationObj.thumbnailUrl || '',
  transcriberId: notationObj.transcriberId,
  updatedAt: notationObj.updatedAt,
  videoUrl: notationObj.videoUrl || '',
});

interface Props {}

const NotationEditor: React.FC<Props> = enhance(() => {
  const [notation, setNotation] = useState<Notation | null>(null);
  const params = useParams<{ id: string }>();

  const getNotation = async (id: string) => {
    const res = await $queries.notation({ id });

    if (res.errors) {
      // TODO(jared) handle errors
      console.error(res.errors);
      return;
    }

    const notationObj = res.data.notation;
    if (!notationObj) {
      // TODO(jared) handle missing notation as error
      console.error('missing notation');
      return;
    }

    const notation = toNotation(notationObj);
    setNotation(notation);
  };

  useEffectOnce(() => {
    getNotation(params.id);
  });

  return (
    <div>
      <br />
      <br />
      <div>edit {params.id}</div>
      <hr />
      {JSON.stringify(notation, null, 2)}
    </div>
  );
});

export default NotationEditor;
