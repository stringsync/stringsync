import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { refreshAuth } from '../../store/modules/auth';
import useEffectOnce from '../../hooks/use-effect-once/useEffectOnce';

const RefreshAuth: React.FC = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector<RootState, boolean>(
    (state) => state.auth.isLoggedIn
  );
  const id = useSelector<RootState, number>((state) => state.auth.user.id);
  useEffectOnce(() => {
    if (!isLoggedIn) {
      return;
    }
    dispatch(refreshAuth({ id }));
  });
  return null;
};

export default RefreshAuth;
