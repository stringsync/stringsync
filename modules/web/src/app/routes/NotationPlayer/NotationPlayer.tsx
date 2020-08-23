import React from 'react';
import { useParams } from 'react-router';

interface Props {}

const NotationPlayer: React.FC<Props> = () => {
  const params = useParams<{ id: string }>();

  return <div>{params.id}</div>;
};

export default NotationPlayer;
