export enum ConfigKind {
  STRING,
  INT,
  FLOAT,
}

export type ConfigSpec<K extends ConfigKind, N extends boolean> = { kind: K; nullable: N };

export type ConfigMapping = Record<string, ConfigSpec<ConfigKind, boolean>>;

export type ConfigGetter<M extends ConfigMapping> = (env?: any) => Config<M>;

export type Config<M extends ConfigMapping> = Readonly<
  {
    [K in keyof M]:
      | (M[K] extends { kind: ConfigKind.INT }
          ? number
          : M[K] extends { kind: ConfigKind.FLOAT }
          ? number
          : M[K] extends { kind: ConfigKind.STRING }
          ? string
          : never)
      | (M[K] extends { nullable: true } ? null : never);
  }
>;
