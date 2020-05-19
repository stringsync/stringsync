import React, { useState } from 'react';
import { compose } from '../../common';
import { withLayout, Layouts } from '../../hocs';
import { useEffectOnce } from '../../hooks';
import { useClient } from '../../hooks/useClient';

interface Props {}

const enhance = compose(withLayout(Layouts.DEFAULT));

const Landing: React.FC<Props> = enhance(() => {
  const [result, setResult] = useState('');
  const client = useClient();
  useEffectOnce(() => {
    client.hello().then((hello) => setResult(hello));
  });
  return <div data-testid="landing">{result}</div>;
});

export default Landing;
