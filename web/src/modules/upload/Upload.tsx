import React from 'react';
import { withLayout } from '../../hocs';
import { Layouts } from '../../hocs/with-layout/Layouts';
import compose from '../../util/compose';

const enhance = compose(withLayout(Layouts.DEFAULT));

interface Props {}

const Upload: React.FC<Props> = enhance(() => {
  return <div>Upload</div>;
});

export default Upload;
