import { Alert } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { AppDispatch, RootState } from '../../../store';
import { clearErrors } from '../../../store/library';

const AlertOuter = styled.div<{ xs: boolean }>`
  margin: 0 ${(props) => (props.xs ? 24 : 0)}px;
`;

interface Props {}

export const LibraryErrors: React.FC<Props> = (props) => {
  const dispatch = useDispatch<AppDispatch>();

  const xs = useSelector<RootState, boolean>((state) => state.viewport.xs);
  const errors = useSelector<RootState, string[]>((state) => state.library.errors);

  const onClose = () => {
    dispatch(clearErrors());
  };

  return errors.length ? (
    <AlertOuter xs={xs}>
      <Alert showIcon type="error" message={errors.join('; ')} closeText="try again" onClose={onClose} />
    </AlertOuter>
  ) : null;
};
