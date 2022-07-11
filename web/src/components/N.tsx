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
import { Frame } from './Frame';
import { FullHeightDiv } from './FullHeightDiv';
import { SuggestedNotations } from './SuggestedNotations';

const DEFAULT_NOTATION_LAYOUT_OPTIONS: notations.NotationLayoutOptions = {
  target: 'sidecar',
  permitted: ['theater', 'sidecar'],
};

const MOBILE_NOTATION_LAYOUT_OPTIONS: notations.NotationLayoutOptions = {
  target: 'theater',
  permitted: ['theater'],
};

const Errors = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
`;

const Sidecar = styled.div`
  background: white;
  height: 100%;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const N: React.FC = () => {
  // notation
  const params = useParams();
  const notationId = params.id || '';
  const [notation, errors, loading] = useNotation(notationId);
  const hasErrors = errors.length > 0;
  const videoUrl = notation?.videoUrl || null;

  // settings
  const [notationSettings, setNotationSettings] = useNotationSettings();
  const [playerSettings, setPlayerSettings] = usePlayerSettings();
  const [scaleSettings, setScaleSettings] = useScaleSettings();

  // layout
  const device = useDevice();
  const viewport = useViewport();
  const { xs, sm, md, innerWidth, innerHeight } = viewport;
  const ltLg = xs || sm || md;
  const layoutOptions = device.mobile || ltLg ? MOBILE_NOTATION_LAYOUT_OPTIONS : DEFAULT_NOTATION_LAYOUT_OPTIONS;
  const isMobileLandscape = device.mobile && innerHeight < innerWidth;
  const isPreferredLayoutPermitted = layoutOptions.permitted.includes(notationSettings.preferredLayout);
  const layout = isPreferredLayoutPermitted ? notationSettings.preferredLayout : notations.getLayout(layoutOptions);

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
  const showEditButton = !authState.isPending && !device.mobile && (isAdmin || isTranscriber);
  const showNotation = !loading && !hasErrors;
  const showSidecarLayout = showNotation && layout === 'sidecar';
  const showTheaterLayout = showNotation && layout === 'theater';

  return (
    <FullHeightDiv data-testid="n">
      {showSidecarLayout && (
        <>
          <Frame split="vertical">
            <div>goodbye</div>
            <div>hello</div>
          </Frame>
        </>
      )}

      {showTheaterLayout && (
        <>
          <Frame split="horizontal">
            <div>goodbye</div>
            <div>hello</div>
          </Frame>
        </>
      )}

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
    </FullHeightDiv>
  );
};

export default N;
