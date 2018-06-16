import { IncludedObjects } from 'utilities';

const RAW_INCLUDED_OBJECTS: JSONApi.IIncluded[] = [
  { type: 'tags', id: 1, attributes: { name: 'foo'} },
  { type: 'tags', id: 2, attributes: { name: 'bar'} },
  { type: 'users', id: 1, attributes: { name: 'foo'} },
  { type: 'users', id: 1, attributes: { name: 'bar'} },
  { type: 'videos', id: 3, attributes: { name: 'baz'} },
  { type: 'videos', id: 4, attributes: { name: 'bam'} },
];

test('IncludedObjects.prototype.fetch works for a single identifier', () => {
  const included = new IncludedObjects(RAW_INCLUDED_OBJECTS);
  const identifier: JSONApi.IIdentifier = { type: 'tags', id: 1 };

  const expected = RAW_INCLUDED_OBJECTS.find(obj => (
    obj.type === identifier.type && obj.id === identifier.id
  ));

  expect(included.fetch(identifier)).toEqual(expected);
});
