import { Replace } from '../../util';
import { CreateNotationInput } from './CreateNotationInput';

export type TestCreateNotationInput = Replace<CreateNotationInput, 'thumbnail' | 'video', Buffer>;
