import { Button } from 'antd';
import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router';
import { notify } from '../../lib/notify';
import { useRandomNotationIdGetter } from './useRandomNotationIdGetter';

export const ImFeelingLucky = () => {
  const history = useHistory();
  const [hasError, setHasError] = useState(false);
  const onSuccess = useCallback(
    (notationId: string) => {
      notify.message.success({ content: 'lucky!' });
      history.push(`/n/${notationId}`);
    },
    [history]
  );
  const onErrors = useCallback(() => {
    notify.message.error({ content: 'something went wrong' });
    setHasError(true);
  }, []);
  const [loading, getRandomNotationId] = useRandomNotationIdGetter(onSuccess, onErrors);

  return (
    <Button type="default" disabled={loading || hasError} onClick={getRandomNotationId}>
      i'm feeling lucky
    </Button>
  );
};
