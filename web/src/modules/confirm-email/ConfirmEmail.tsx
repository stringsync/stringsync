import React, { useEffect } from 'react';
import { compose } from '../../common';
import { withLayout, Layouts } from '../../hocs';
import { useLocation } from 'react-router';
import { EMAIL_CONF_TOKEN_QUERY_PARAM_NAME } from '../../common';
import { useSelector } from '../../hooks';
import { confirmEmail } from '../../store';
import { useDispatch } from 'react-redux';

const enhance = compose(withLayout(Layouts.DEFAULT));

const ConfirmEmail = enhance(() => {
  const isPending = useSelector((state) => state.email.isPending);
  const isConfirmed = useSelector((state) => state.email.isConfirmed);
  const errors = useSelector((state) => state.email.errors);
  const dispatch = useDispatch();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const confirmationToken = params.get(EMAIL_CONF_TOKEN_QUERY_PARAM_NAME) || '';

  useEffect(() => {
    dispatch(confirmEmail({ confirmationToken }));
  }, [confirmationToken, dispatch]);

  if (isPending) {
    return <div>Confirming token...</div>;
  }

  if (isConfirmed) {
    return <div>Confirmed</div>;
  }

  if (errors.length > 0) {
    return <div>Request another token: {JSON.stringify(errors)}</div>;
  }

  return confirmationToken;
});

export default ConfirmEmail;
