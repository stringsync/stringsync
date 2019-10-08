import React from 'react';
import { useDispatch } from 'react-redux';
import { refreshAuth } from '../../store/modules/auth';
import useEffectOnce from '../../hooks/use-effect-once/useEffectOnce';

const ReauthOnce: React.FC = () => {
  const dispatch = useDispatch();
  useEffectOnce(() => {
    dispatch(refreshAuth());
  });
  return null;
};

export default ReauthOnce;
