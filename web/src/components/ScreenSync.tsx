import React from 'react';
import { useResize } from '../hooks/useResize';
import { useDispatch } from 'react-redux';
import { SET_DIMENSIONS } from '../store/screen/types';
import { throttle } from 'lodash';

const THROTTLE_WAIT_MS = 250;

interface Props {}

const ScreenSync: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const setDimensions = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    dispatch({
      type: SET_DIMENSIONS,
      payload: { width, height },
    });
  };
  useResize(throttle(setDimensions, THROTTLE_WAIT_MS));
  return null;
};

export default ScreenSync;
