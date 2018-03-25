/**
 * Transforms the included arrays into objects indexed by id, then by type
 * 
 * @param {object} included 
 * @return {object}
 */
const indexIncluded = included => (
  included.reduce((memo, object) => {
    const { type, id, attributes, links } = object;
    memo[type] = memo[type] || {};
    memo[type][id] = { attributes, links };
    return memo;
  }, {})
);

export default indexIncluded;
