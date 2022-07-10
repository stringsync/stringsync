import { Alert, Row } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../ctx/auth';
import { useDevice } from '../ctx/device';
import { useViewport } from '../ctx/viewport';
import { useNoOverflow } from '../hooks/useNoOverflow';
import { useNotation } from '../hooks/useNotation';
import { useNotationSettings } from '../hooks/useNotationSettings';
import { useNoTouchAction } from '../hooks/useNoTouchAction';
import { useNoTouchCallout } from '../hooks/useNoTouchCallout';
import { useNoUserSelect } from '../hooks/useNoUserSelect';
import { usePlayerSettings } from '../hooks/usePlayerSettings';
import { useScaleSettings } from '../hooks/useScaleSettings';
import { UserRole } from '../lib/graphql';
import * as notations from '../lib/notations';
import { FullHeightDiv } from './FullHeightDiv';
import { SuggestedNotations } from './SuggestedNotations';

const Errors = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
`;

const DEFAULT_NOTATION_LAYOUT_OPTIONS: notations.NotationLayoutOptions = {
  target: 'sidecar',
  permitted: ['theater', 'sidecar'],
};

const MOBILE_NOTATION_LAYOUT_OPTIONS: notations.NotationLayoutOptions = {
  target: 'theater',
  permitted: ['theater'],
};

export const N: React.FC = () => {
  // layout
  const device = useDevice();
  const { xs, sm, md, innerWidth, innerHeight } = useViewport();
  const ltLg = xs || sm || md;
  const layoutOptions = device.mobile || ltLg ? MOBILE_NOTATION_LAYOUT_OPTIONS : DEFAULT_NOTATION_LAYOUT_OPTIONS;
  const isMobileLandscape = device.mobile && innerHeight < innerWidth;

  // notation
  const params = useParams();
  const notationId = params.id || '';
  const [notation, errors, loading] = useNotation(notationId);
  const hasErrors = errors.length > 0;

  // settings
  const [notationSettings, setNotationSettings] = useNotationSettings();
  const [playerSettings, setPlayerSettings] = usePlayerSettings();
  const [scaleSettings, setScaleSettings] = useScaleSettings();

  // auth
  const [authState] = useAuth();
  const isAdmin = authState.user.role === UserRole.ADMIN;
  const isTranscriber = authState.user.id === notation?.transcriber.id;

  // css effects
  useNoOverflow(hasErrors ? null : document.body);
  useNoUserSelect(document.body);
  useNoTouchAction(document.body);
  useNoTouchCallout(document.body);

  // render branches
  const showErrors = !loading && hasErrors;
  const showNotation = !loading && !hasErrors;
  const showEditButton = !authState.isPending && !device.mobile && (isAdmin || isTranscriber);

  return (
    <FullHeightDiv data-testid="n">
      {showErrors && (
        <Errors>
          <Row justify="center">
            <Alert
              showIcon
              type="error"
              message="error"
              description={
                <>
                  {errors.map((error, ndx) => (
                    <div key={ndx}>{error}</div>
                  ))}
                </>
              }
            />
          </Row>

          <br />

          <Row justify="center">
            <SuggestedNotations srcNotationId={notationId} />
          </Row>
        </Errors>
      )}

      {showNotation && <div>notation</div>}
    </FullHeightDiv>
  );
};

export default N;
