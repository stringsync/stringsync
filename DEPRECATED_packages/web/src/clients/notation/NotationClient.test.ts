import { GraphqlClient } from './../graphql/GraphqlClient';
import { NotationClient } from './NotationClient';

let notationClient: NotationClient;
let graphqlClient: GraphqlClient;
const fakeRes = { data: {} };

beforeEach(() => {
  notationClient = NotationClient.create();
  graphqlClient = notationClient.graphqlClient;
});

it('queries notations', async () => {
  const callSpy = jest.spyOn(graphqlClient, 'call');
  callSpy.mockResolvedValue(fakeRes);

  const res = await notationClient.notations({});

  expect(res).toStrictEqual(fakeRes);
});
