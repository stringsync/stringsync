import { ConfigGetter, ConfigKind } from './types';
export declare const configFactory: <S extends Record<string, {
    kind: ConfigKind;
    nullable: boolean;
}>>(spec: S) => ConfigGetter<S>;
