import { vextabDecoder as VextabDecoder, VextabEncoder } from './';
import { omit, isObject } from 'lodash';
import { VEXTAB_STRINGS } from 'test';

test('VextabDecoder.decode can decode a number of valid vextabStrings', () => {
  VEXTAB_STRINGS.forEach(vextabString => {
    VextabDecoder.parse(vextabString);
  });
});

test('VextabEncoder.encode produces strings that can be decoded to produce the same VextabStructs', () => {
  VEXTAB_STRINGS.forEach(vextabString => {
    const vextabStructs = VextabDecoder.parse(vextabString);
    const reEncodedVextabString = VextabEncoder.encode(vextabStructs);
    const reDecodedVextabStructs = VextabDecoder.parse(reEncodedVextabString);

    // recursively omit the props that correspond to the string position
    const omitStrPosInfo = thing => {
      if (Array.isArray(thing)) {
        return thing.map(element => omitStrPosInfo(element));
      } else if (isObject(thing)) {
        const object = {};
        Object.keys(thing).forEach(key => object[key] = omitStrPosInfo(thing[key]));
        return omit(object, ['_l', '_c0', '_c1']);
      } else {
        return thing;
      }
    };

    expect(vextabStructs.length > 0).toBe(true);
    expect(reDecodedVextabStructs.length).toBe(vextabStructs.length);
    expect(reDecodedVextabStructs).not.toBe(vextabStructs);
    expect(omitStrPosInfo(reDecodedVextabStructs)).toEqual(omitStrPosInfo(vextabStructs));
  });
});
