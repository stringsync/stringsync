import { Base64 } from '@stringsync/common';
import { Pager } from '../util';
import { User } from '@stringsync/domain';
import { injectable } from 'inversify';

const CURSOR_TYPE = 'user';
const CURSOR_DELIMITER = ':';

@injectable()
export class UserPager extends Pager<User> {
  defaultLimit = 10;

  decodeCursor(encodedCursor: string): number {
    const [cursorType, cursor] = Base64.decode(encodedCursor).split(CURSOR_DELIMITER);
    if (cursorType !== CURSOR_TYPE) {
      throw new Error(`expected cursor type '${CURSOR_TYPE}', got: ${cursorType}`);
    }
    try {
      return parseInt(cursor, 10);
    } catch (e) {
      throw new Error(`cannot decode cursor: ${cursor}`);
    }
  }

  encodeCursor(decodedCursor: number): string {
    return Base64.encode(`${CURSOR_TYPE}${CURSOR_DELIMITER}${decodedCursor}`);
  }
}
