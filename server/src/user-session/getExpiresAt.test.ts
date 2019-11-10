import { getExpiresAt } from './getExpiresAt';

it('adds 14 days to the reference date', (done) => {
  const from = new Date('2019-01-01');
  const expected = new Date('2019-01-15').getTime();

  const actual = getExpiresAt(from).getTime();
  expect(actual).toBe(expected);
  done();
});
