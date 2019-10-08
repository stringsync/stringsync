import React from 'react';
import { useDispatch } from 'react-redux';
import { reauth } from '../../store/modules/auth';
import useEffectOnce from '../../hooks/use-effect-once/useEffectOnce';

const ReauthOnce: React.FC = () => {
  const dispatch = useDispatch();
  useEffectOnce(() => {
    dispatch(reauth());
  });
  return null;
};

export default ReauthOnce;
