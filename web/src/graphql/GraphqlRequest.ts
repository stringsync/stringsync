import { extractFiles } from 'extract-files';
import { RequestNamesOf, RequestType, RequestVariables } from './types';

export abstract class GraphqlRequest<
  T extends RequestType,
  N extends RequestNamesOf<T>,
  V extends RequestVariables = void
> {
  abstract readonly name: N;
  abstract readonly query: string;

  toFormData(variables: V): FormData {
    // extract files
    const extraction = extractFiles<File>(
      { query: this.query, variables },
      undefined,
      (value: any): value is File => value instanceof File
    );
    const clone = extraction.clone;
    const fileMap = extraction.files;

    // compute map
    const map: { [key: string]: string | string[] } = {};
    const pathGroups = Array.from(fileMap.values());
    for (let ndx = 0; ndx < pathGroups.length; ndx++) {
      const paths = pathGroups[ndx];
      map[ndx] = paths;
    }

    // create form data
    const formData = new FormData();
    formData.append('operations', JSON.stringify(clone));
    formData.append('map', JSON.stringify(map));

    // append files to form data
    const files = Array.from(fileMap.keys());
    for (let ndx = 0; ndx < files.length; ndx++) {
      const file = files[ndx];
      formData.append(ndx.toString(), file, `@${file.name}`);
    }

    return formData;
  }
}
