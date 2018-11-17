import { getDefaultState as notations } from './notations/getDefaultState';
import { getDefaultState as notation } from './notation/getDefaultState';
import { getDefaultState as session } from './session/getDefaultState';
import { getDefaultState as tags } from './tags/getDefaultState';
import { getDefaultState as video } from './video/getDefaultState';

export default Object.freeze({
  notations: notations(),
  notation: notation(),
  session: session(),
  tags: tags(),
  video: video()
});
