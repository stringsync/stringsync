/**
 * RafSpecs are used by the RafLoop to execute callback functions in a deterministic manner.
 */
class RafSpec {
  /**
   * @param {string} name 
   * @param {number} precedence 
   * @param {function} callback 
   */
  constructor(name, precedence, callback) {
    this.name = name;
    this.precedence = precedence;
    this.callback = callback;
  }
};

export default RafSpec;
