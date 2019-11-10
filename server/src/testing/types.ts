import { Models } from '../db';

export type FixtureMap = Partial<
  {
    [M in keyof Models]: any[];
  }
>;
