import { Button, message } from 'antd';
import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router';
import { useRandomNotationIdGetter } from './useRandomNotationIdGetter';

export const ImFeelingLucky = () => {
  const history = useHistory();
  const [hasError, setHasError] = useState(false);
  const onSuccess = useCallback(
    (notationId: string) => {
      message.success('lucky!');
      history.push(`/n/${notationId}`);
    },
    [history]
  );
  const onErrors = useCallback(() => {
    message.error('something went wrong');
    setHasError(true);
  }, []);
  const [loading, getRandomNotationId] = useRandomNotationIdGetter(onSuccess, onErrors);

  return (
    <Button type="default" loading={loading} disabled={hasError} onClick={getRandomNotationId}>
      i'm feeling lucky
    </Button>
  );
};
