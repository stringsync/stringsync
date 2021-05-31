import React from 'react';
import { useParams } from 'react-router';
import { Layout, withLayout } from '../../../hocs';
import { compose } from '../../../util/compose';

const enhance = compose(withLayout(Layout.DEFAULT));

interface Props {}

const NotationEditor: React.FC<Props> = enhance(() => {
  const params = useParams<{ id: string }>();

  return <div>edit {params.id}</div>;
});

export default NotationEditor;
