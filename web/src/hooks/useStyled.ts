import { useMemo, DependencyList } from 'react';
import styled, { ThemedStyledInterface } from 'styled-components';
import { theme } from '../theme';

type Styled = ThemedStyledInterface<typeof theme>;

type StyledFactory<T> = (styled: Styled) => T;

export const useStyled = <T>(
  factory: StyledFactory<T>,
  deps: DependencyList = []
) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => factory(styled), [...deps]);
};
