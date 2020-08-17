import { Base64, Pager } from '@stringsync/common';
import { Notation } from '@stringsync/domain';
import { injectable } from 'inversify';

const CURSOR_TYPE = 'notation';
const CURSOR_DELIMITER = ':';

@injectable()
export class NotationSequelizePager extends Pager<Notation> {
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
