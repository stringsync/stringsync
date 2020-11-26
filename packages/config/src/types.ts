export enum ConfigKind {
  STRING,
  INT,
  FLOAT,
}

export type ConfigSpec = Record<string, { kind: ConfigKind; nullable: boolean }>;

export type ConfigGetter<S extends ConfigSpec> = (env?: any) => Config<S>;

export type Config<S extends ConfigSpec> = Readonly<
  {
    [K in keyof S]:
      | (S[K] extends { kind: ConfigKind.INT }
          ? number
          : S[K] extends { kind: ConfigKind.FLOAT }
          ? number
          : S[K] extends { kind: ConfigKind.STRING }
          ? string
          : never)
      | (S[K] extends { nullable: true } ? null : never);
  }
>;
