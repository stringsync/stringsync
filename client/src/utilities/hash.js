// https://github.com/darkskyapp/string-hash
const hash = str => {
  let hsh = 5381;
  let ndx = str.length;

  while (ndx) {
    hsh = (hsh * 33) ^ str.charCodeAt(--ndx);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hsh >>> 0;
};

export default hash;
