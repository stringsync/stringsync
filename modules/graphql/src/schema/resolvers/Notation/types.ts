import { CreateNotationInput } from './CreateNotationInput';
import { Replace } from '@stringsync/common';

export type TestCreateNotationInput = Replace<CreateNotationInput, 'thumbnail' | 'video', Blob>;
