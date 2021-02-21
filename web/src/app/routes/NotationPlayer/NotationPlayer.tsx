import React from 'react';
import { useParams } from 'react-router';
import { Layout, withLayout } from '../../../hocs';
import { compose } from '../../../util/compose';

const enhance = compose(withLayout(Layout.DEFAULT));

interface Props {}

const NotationPlayer: React.FC<Props> = enhance(() => {
  const params = useParams<{ id: string }>();

  return <div>{params.id}</div>;
});

export default NotationPlayer;
