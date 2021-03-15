import { GraphqlClient } from '../graphql/GraphqlClient';
import { TagClient } from './TagClient';

describe('TagClient', () => {
  let tagClient: TagClient;
  let graphqlClient: GraphqlClient;
  const fakeRes = { data: {} };

  beforeEach(() => {
    tagClient = TagClient.create();
    graphqlClient = tagClient.graphqlClient;
  });

  it('queries notations', async () => {
    const callSpy = jest.spyOn(graphqlClient, 'call');
    callSpy.mockResolvedValue(fakeRes);

    const res = await tagClient.tags();

    expect(res).toStrictEqual(fakeRes);
  });
});
