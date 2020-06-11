import React from 'react';
import { withLayout, Layouts } from '../../hocs';
import { compose } from '../../common';

const enhance = compose(withLayout(Layouts.DEFAULT));

interface Props {}

const Upload: React.FC<Props> = enhance(() => {
  return <div>Upload</div>;
});

export default Upload;
