import { ConfigKind } from './types';
export declare const SIMPLE_CONFIG: import("./types").ConfigGetter<{
    PORT: {
        kind: ConfigKind.INT;
        nullable: false;
    };
}>;
export declare type SimpleConfig = ReturnType<typeof SIMPLE_CONFIG>;
