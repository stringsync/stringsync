import { GraphQLError } from 'graphql';
import { getErrorFormatter } from './getErrorFormatter';

const NONPROD_ENVS = ['development', 'test', 'foobar'];
const PROD_ENV = 'production';
const SECRET_SERVER_DETAILS = 'do not want clients to see this in prod';
const SANITIZED_SERVER_DETAILS = 'something went wrong';
const NON_INTERNAL_SERVER_ERROR = new GraphQLError(SECRET_SERVER_DETAILS);
const INTERNAL_SERVER_ERROR = new GraphQLError(
  SECRET_SERVER_DETAILS,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  { code: 'INTERNAL_SERVER_ERROR' }
);

test('does not sanitize internal errors in nonprod', (done) => {
  for (const env of NONPROD_ENVS) {
    const errorFormatter = getErrorFormatter(env);
    expect(errorFormatter(INTERNAL_SERVER_ERROR).message).toEqual(
      SECRET_SERVER_DETAILS
    );
  }
  done();
});

test('does not sanitize non internal errors in nonprod', (done) => {
  for (const env of NONPROD_ENVS) {
    const errorFormatter = getErrorFormatter(env);
    expect(errorFormatter(NON_INTERNAL_SERVER_ERROR).message).toEqual(
      SECRET_SERVER_DETAILS
    );
  }
  done();
});

test('sanitizes internal server errors in prod', (done) => {
  const errorFormatter = getErrorFormatter(PROD_ENV);
  expect(errorFormatter(INTERNAL_SERVER_ERROR).message).toEqual(
    SANITIZED_SERVER_DETAILS
  );
  done();
});

test('does not sanitize non internal server errors in prod', (done) => {
  const errorFormatter = getErrorFormatter(PROD_ENV);
  expect(errorFormatter(NON_INTERNAL_SERVER_ERROR).message).toEqual(
    SECRET_SERVER_DETAILS
  );
  done();
});
