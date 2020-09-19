export enum ConfigKind {
  STRING,
  INT,
  FLOAT,
}

export type ConfigSpec = Record<string, ConfigKind>;

export type ConfigGetter<S extends ConfigSpec> = (env?: any) => Config<S>;

export type Config<S extends ConfigSpec> = Readonly<
  {
    [K in keyof S]: S[K] extends ConfigKind.INT
      ? number
      : S[K] extends ConfigKind.FLOAT
      ? number
      : S[K] extends ConfigKind.STRING
      ? string
      : never;
  }
>;
