import '../inversify.config'; // need reflect metadata
import { generateSchema } from './generateSchema';

describe('generateSchema', () => {
  it('runs without crashing', () => {
    expect(generateSchema).not.toThrow();
  });
});
