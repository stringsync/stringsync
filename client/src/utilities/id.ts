let ID_BASE = 0;

/**
 * Returns a unique positive ID for ephermeral class instances.
 */
export const id = () => {
  ID_BASE = ID_BASE === Number.MAX_SAFE_INTEGER ? 0 : ID_BASE + 1;
  return ID_BASE;
}
