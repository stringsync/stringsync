import React, { useState } from 'react';
import { compose } from '../../common';
import { Layouts, withLayout } from '../../hocs';
import { useEffectOnce } from '../../hooks';

interface Props {}

const enhance = compose(withLayout(Layouts.DEFAULT));

const Library: React.FC<Props> = enhance(() => {
  const [result, setResult] = useState({});
  useEffectOnce(() => {
    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{ hello }`,
      }),
    })
      .then((res) => res.json())
      .then((json) => setResult(json));
  });

  return <pre data-testid="library">{JSON.stringify(result, null, 2)}</pre>;
});

export default Library;
