import { Button, message } from 'antd';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useRandomNotationIdGetter } from './useRandomNotationIdGetter';

export const ImFeelingLucky = () => {
  const history = useHistory();
  const [notationId, loading, errors, getRandomNotationId] = useRandomNotationIdGetter();

  // The notation ID can only be populated after the "i'm feeling lucky" button is clicked. Once it's populated,
  // navigate to it immediately.
  useEffect(() => {
    if (notationId && !loading) {
      message.success('lucky!');
      history.push(`/n/${notationId}`);
    }
  }, [notationId, loading, history]);

  useEffect(() => {
    if (errors.length > 0) {
      message.error('something went wrong');
    }
  }, [errors]);

  return (
    <Button type="default" loading={loading} disabled={errors.length > 0} onClick={getRandomNotationId}>
      i'm feeling lucky
    </Button>
  );
};
