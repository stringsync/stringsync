import { getDefaultState as notations } from './notations/getDefaultState';
import { getDefaultState as session } from './session/getDefaultState';

export default Object.freeze({
  notations: notations(),
  session: session()
});
