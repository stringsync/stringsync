let ID_BASE = 0;

/**
 * Returns a unique positive ID for ephermeral class instances.
 */
export const id = () => ID_BASE++;
(window as any).id = id;