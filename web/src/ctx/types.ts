import { AnyAction } from 'redux';
import { ValuesOf } from '../util/types';

type AnyActionCreator = (...args: any[]) => AnyAction;

export type Dispatch<T extends Record<string, AnyActionCreator>> = (action: ReturnType<ValuesOf<T>>) => void;
