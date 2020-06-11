import { theme } from '../theme';
import { ThemedStyledInterface } from 'styled-components';

export interface Config {
  REACT_APP_SERVER_URI: string;
}

export type Styled = ThemedStyledInterface<typeof theme>;
