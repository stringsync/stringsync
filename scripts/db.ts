import * as aws from './aws';

type DbCreds = {
  password: string;
  dbname: string;
  port: number;
  host: string;
  username: string;
};

type DbEnv = {
  DB_NAME: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: string;
};

const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

const isNumber = (value: unknown): value is number => {
  return typeof value === 'number';
};

const isDbCreds = (value: any): value is DbCreds => {
  return (
    isString(value.password) &&
    isString(value.dbname) &&
    isNumber(value.port) &&
    isString(value.host) &&
    isString(value.username)
  );
};

export async function getDbEnv(stackName: string, awsRegion: string): Promise<DbEnv> {
  const secretId = await aws.getStackOutputValue(stackName, 'DbCredsSecret');
  const dbCredsJson = await aws.getSecretValue(secretId, awsRegion);
  const dbCreds = JSON.parse(dbCredsJson);

  console.log(typeof dbCreds);
  console.log(typeof {});

  if (!isDbCreds(dbCreds)) {
    throw new Error(`unexpected secret, check that secret '${secretId}' has keys needed for Db creds`);
  }

  return {
    DB_NAME: dbCreds.dbname,
    DB_USERNAME: dbCreds.username,
    DB_HOST: dbCreds.host,
    DB_PASSWORD: dbCreds.password,
    DB_PORT: dbCreds.port.toString(),
  };
}
