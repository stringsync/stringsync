import * as graphqlUpload from 'graphql-upload';
import { randStr } from '../util';

class PurposelyBrokenReadStreamDontCallAnythingOnThis {}

export const createRandUpload = (): unknown => {
  const Upload = (graphqlUpload as any).Upload;
  if (typeof Upload === 'undefined') {
    throw new Error('Upload is not defined in the graphql-upload package');
  }
  const fileUpload: graphqlUpload.FileUpload = {
    filename: randStr(12),
    mimetype: randStr(12),
    encoding: randStr(12),
    createReadStream: jest.fn().mockReturnValue(new PurposelyBrokenReadStreamDontCallAnythingOnThis()),
  };
  const upload = new Upload();
  upload.promise = Promise.resolve(fileUpload);
  return upload;
};
