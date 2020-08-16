import { mapKeys, camelCase } from 'lodash';

export const camelCaseKeys = <T>(rows: any[]): T[] => {
  return rows.map((row: any) => mapKeys(row, (_, col) => camelCase(col))) as T[];
};
