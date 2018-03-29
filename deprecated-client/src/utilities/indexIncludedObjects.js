import { camelCaseKeys } from 'utilities';

/**
 * Transforms the included arrays into objects indexed by id, then by type
 * 
 * @param {object} included 
 * @return {object}
 */
const indexIncludedObjects = included => {
  const indexed = included.reduce((memo, object) => {
    const { type, id, attributes, links } = object;
    memo[type] = memo[type] || {};
    memo[type][id] = { attributes, links };
    return memo;
  }, {});

  return camelCaseKeys(indexed, true);
};

export default indexIncludedObjects;
