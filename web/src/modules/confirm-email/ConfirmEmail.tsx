import React from 'react';
import { compose } from '../../util';
import { withLayout, Layouts } from '../../hocs';

const enhance = compose(withLayout(Layouts.DEFAULT));

const ConfirmEmail = enhance(() => {
  return <div>ConfirmEmail</div>;
});

export default ConfirmEmail;
