import { getDefaultState as notations } from './notations/getDefaultState';
import { getDefaultState as session } from './session/getDefaultState';
import { getDefaultState as tags } from './tags/getDefaultState';

export default Object.freeze({
  notations: notations(),
  session: session(),
  tags: tags()
});
