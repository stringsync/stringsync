import * as graphqlUpload from 'graphql-upload';
import { rand } from '../util';

class PurposelyBrokenReadStreamDontCallAnythingOnThis {}

export const createRandUpload = (): unknown => {
  const Upload = (graphqlUpload as any).Upload;
  if (typeof Upload === 'undefined') {
    throw new Error('Upload is not defined in the graphql-upload package');
  }
  const fileUpload: graphqlUpload.FileUpload = {
    filename: rand.str(12),
    mimetype: rand.str(12),
    encoding: rand.str(12),
    createReadStream: jest.fn().mockReturnValue(new PurposelyBrokenReadStreamDontCallAnythingOnThis()),
  };
  const upload = new Upload();
  upload.promise = Promise.resolve(fileUpload);
  return upload;
};
