export type SequelizeDbConfig = {
  env: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  logging?: boolean | ((sql: string, timing?: number) => void);
};
