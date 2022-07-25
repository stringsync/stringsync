import { Row } from 'antd';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Layout, withLayout } from '../hocs/withLayout';
import { useNotation } from '../hooks/useNotation';
import { Errors } from './Errors';

const POPUP_ERRORS = ['must open through exporter'];

const Outer = styled.div``;

const ErrorsOuter = styled.div`
  margin-top: 24px;
`;

const CallToActionLink = styled(Link)`
  margin-top: 24px;
`;

const Recorder = styled.div``;

const enhance = withLayout(Layout.NONE, { footer: false, lanes: false });

export const NRecord: React.FC = enhance(() => {
  // params
  const params = useParams();
  const notationId = params.id || '';
  const [notation, errors, loading] = useNotation(notationId);

  // render branches
  const renderPopupError = !window.opener;
  const renderNotationErrors = !renderPopupError && !loading && errors.length > 0;
  const renderRecorder = !renderPopupError && !renderNotationErrors && !!notation;

  return (
    <Outer data-testid="n-record">
      {renderPopupError && (
        <ErrorsOuter>
          <Errors errors={POPUP_ERRORS} />

          <Row justify="center">
            <CallToActionLink to={`/n/${notationId}/export`}>exporter</CallToActionLink>
          </Row>
        </ErrorsOuter>
      )}

      {renderNotationErrors && (
        <ErrorsOuter>
          <Errors errors={errors} />

          <Row justify="center">
            <CallToActionLink to="/library">library</CallToActionLink>
          </Row>
        </ErrorsOuter>
      )}

      {renderRecorder && <Recorder>recorder</Recorder>}
    </Outer>
  );
});

export default NRecord;
