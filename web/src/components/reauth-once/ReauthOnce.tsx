import React from 'react';
import { useDispatch } from 'react-redux';
import { getReauthAction } from '../../store';
import { useEffectOnce } from '../../hooks';

const ReauthOnce: React.FC = () => {
  const dispatch = useDispatch();
  useEffectOnce(() => {
    const reauthAction = getReauthAction();
    dispatch(reauthAction);
  });
  return null;
};

export default ReauthOnce;
