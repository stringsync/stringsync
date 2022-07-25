import React from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Layout, withLayout } from '../hocs/withLayout';
import { Errors } from './Errors';

const POPUP_ERRORS = ['must open through exporter'];

const ExportLink = styled.div`
  text-align: center;
  margin-top: 24px;
`;

const enhance = withLayout(Layout.NONE, { footer: false, lanes: false });

export const NRecord: React.FC = enhance(() => {
  // params
  const params = useParams();
  const notationId = params.id || '';

  // window ctx
  const isPopup = !!window.opener;

  // render branches
  const renderPopupError = !isPopup;

  return (
    <div data-testid="n-record">
      {renderPopupError && (
        <div>
          <br />
          <br />

          <Errors errors={POPUP_ERRORS} />

          <ExportLink>
            <Link to={`/n/${notationId}/export`}>exporter</Link>
          </ExportLink>
        </div>
      )}
    </div>
  );
});

export default NRecord;
