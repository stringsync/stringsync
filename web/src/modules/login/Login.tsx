import React from 'react';
import compose from '../../util/compose';
import { withLayout } from '../../hocs';
import { Layouts } from '../../hocs/with-layout/Layouts';

interface Props {}

const enhance = compose(withLayout({ layout: Layouts.NONE, props: {} }));

const Login: React.FC<Props> = enhance(() => {
  return <div>Login</div>;
});

export default Login;
