import { IncludedObjects } from 'utilities';
import { shuffle, pick, take } from 'lodash';

const RAW_INCLUDED_OBJECTS: JSONApi.IIncluded[] = [
  { type: 'tags', id: 1, attributes: { name: 'foo'} },
  { type: 'tags', id: 2, attributes: { name: 'bar'} },
  { type: 'users', id: 1, attributes: { name: 'foo'} },
  { type: 'users', id: 2, attributes: { name: 'bar'} },
  { type: 'videos', id: 3, attributes: { name: 'baz'} },
  { type: 'videos', id: 4, attributes: { name: 'bam'} },
];

const getIdentifier = (object: JSONApi.IIdentifier) => pick(object, ['id', 'type']);

test('IncludedObjects.prototype.fetch works for a single identifier', () => {
  const included = new IncludedObjects(RAW_INCLUDED_OBJECTS);
  
  RAW_INCLUDED_OBJECTS.forEach(object => {
    const identifier = getIdentifier(object);
    const expected = RAW_INCLUDED_OBJECTS.find(obj => (
      obj.type === identifier.type && obj.id === identifier.id
    ));

    expect(included.fetch(identifier)).toEqual(expected);
  });
});

test('IncludedObjects.prototype.fetch works for an array of identifiers', () => {
  for (let ndx = 0; ndx < 5; ndx++) {
    const rawIncludedObjects = shuffle(RAW_INCLUDED_OBJECTS);
    const included = new IncludedObjects(rawIncludedObjects);

    const expected = take(rawIncludedObjects, 3);
    const identifiers = expected.map(getIdentifier);
    
    expect(included.fetch(identifiers)).toEqual(expected);
  }
});
