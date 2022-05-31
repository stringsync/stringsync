import { Alert, Button, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../ctx/auth';
import { useDevice } from '../ctx/device';
import { useViewport } from '../ctx/viewport/useViewport';
import { Layout, withLayout } from '../hocs/withLayout';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useMemoCmp } from '../hooks/useMemoCmp';
import { useNoOverflow } from '../hooks/useNoOverflow';
import { useNotation } from '../hooks/useNotation';
import { useNoTouchAction } from '../hooks/useNoTouchAction';
import { useNoTouchCallout } from '../hooks/useNoTouchCallout';
import { useNoUserSelect } from '../hooks/useNoUserSelect';
import { UserRole } from '../lib/graphql';
import { DisplayMode } from '../lib/musicxml';
import * as notations from '../lib/notations';
import { compose } from '../util/compose';
import { scrollToTop } from '../util/scrollToTop';
import { FullHeightDiv } from './FullHeightDiv';
import { Notation } from './Notation';
import { SuggestedNotations } from './SuggestedNotations';

type PersistentSettings = Pick<
  notations.NotationSettings,
  | 'isFretboardVisible'
  | 'isAutoscrollPreferred'
  | 'isVideoVisible'
  | 'fretMarkerDisplay'
  | 'preferredLayout'
  | 'defaultSidecarWidthPx'
  | 'defaultTheaterHeightPx'
  | 'displayMode'
>;

const NOTATION_SHOW_SETTINGS_KEY = 'stringsync_notation_settings';

const DEFAULT_NOTATION_LAYOUT_OPTIONS: notations.NotationLayoutOptions = {
  target: 'sidecar',
  permitted: ['theater', 'sidecar'],
};

const MOBILE_NOTATION_LAYOUT_OPTIONS: notations.NotationLayoutOptions = {
  target: 'theater',
  permitted: ['theater'],
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const ErrorsOuter = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 24px;
`;

const ErroredSuggestedNotationsOuter = styled.div`
  margin: 0 auto;
  max-width: 500px;
`;

const enhance = compose(withLayout(Layout.NONE, { lanes: false, footer: false }));

const NotationShow: React.FC = enhance(() => {
  // layout
  const device = useDevice();
  const { xs, sm, md, innerWidth, innerHeight } = useViewport();
  const ltLg = xs || sm || md;
  const layoutOptions = device.mobile || ltLg ? MOBILE_NOTATION_LAYOUT_OPTIONS : DEFAULT_NOTATION_LAYOUT_OPTIONS;
  const isMobileLandscape = device.mobile && innerHeight < innerWidth;

  // notation
  const params = useParams<{ id: string }>();
  const [notation, errors, isNotationLoading] = useNotation(params.id!);
  const hasErrors = errors.length > 0;
  useEffect(() => {
    scrollToTop();
  }, [params.id]);

  // suggested notations
  const [isSuggestedNotationsLoading, setIsSuggestedNotationsLoading] = useState(false);
  const onSuggestedNotationsLoadStart = () => {
    setIsSuggestedNotationsLoading(true);
  };
  const onSuggestedNotationsLoadEnd = () => {
    setIsSuggestedNotationsLoading(false);
  };

  // auth
  const [authState] = useAuth();
  const isAdmin = !authState.isPending && authState.user.role === UserRole.ADMIN;
  const isTranscriber = !authState.isPending && authState.user.id === notation?.transcriber.id;
  const canEdit = !device.mobile && (isAdmin || isTranscriber);

  // css effects
  useNoOverflow(hasErrors ? null : document.body);
  useNoUserSelect(document.body);
  useNoTouchAction(document.body);
  useNoTouchCallout(document.body);

  // settings
  const initialDefaultSettings = useMemoCmp<PersistentSettings>({
    preferredLayout: 'sidecar',
    isVideoVisible: true,
    isFretboardVisible: !device.mobile,
    isAutoscrollPreferred: true,
    fretMarkerDisplay: notations.FretMarkerDisplay.None,
    defaultSidecarWidthPx: 500,
    defaultTheaterHeightPx: 200,
    displayMode: DisplayMode.TabsOnly,
  });
  const [defaultSettings, setDefaultSettings] = useLocalStorage<PersistentSettings>(
    NOTATION_SHOW_SETTINGS_KEY,
    initialDefaultSettings
  );
  const onSettingsChange = useCallback(
    (settings: notations.NotationSettings) => {
      setDefaultSettings({
        preferredLayout: settings.preferredLayout,
        isVideoVisible: settings.isVideoVisible,
        isFretboardVisible: settings.isFretboardVisible,
        isAutoscrollPreferred: settings.isAutoscrollPreferred,
        fretMarkerDisplay: settings.fretMarkerDisplay,
        defaultSidecarWidthPx: settings.defaultSidecarWidthPx,
        defaultTheaterHeightPx: settings.defaultTheaterHeightPx,
        displayMode: settings.displayMode,
      });
    },
    [setDefaultSettings]
  );

  // loading
  const [isNotationInitialized, setIsNotationInitialized] = useState(false);
  const onNotationInit = useCallback(() => {
    setIsNotationInitialized(true);
  }, []);
  const skeleton = errors.length === 0 && (!isNotationInitialized || isNotationLoading || isSuggestedNotationsLoading);

  return (
    <FullHeightDiv data-testid="notation-show">
      {isMobileLandscape && (
        <Overlay>
          <h2>
            Mobile landscape mode is not supported <em>yet</em>.
          </h2>
        </Overlay>
      )}

      {!hasErrors && (
        <Notation
          skeleton={skeleton}
          onInit={onNotationInit}
          notation={notation}
          sidecar={
            <div>
              {canEdit && !skeleton && (
                <Link to={`/n/${params.id}/edit`}>
                  <Button block type="default" size="large">
                    edit
                  </Button>
                </Link>
              )}
              <SuggestedNotations
                skeleton={skeleton}
                srcNotationId={params.id!}
                onLoadStart={onSuggestedNotationsLoadStart}
                onLoadEnd={onSuggestedNotationsLoadEnd}
              />
              2
            </div>
          }
          layoutOptions={layoutOptions}
          defaultSettings={defaultSettings}
          onSettingsChange={onSettingsChange}
        />
      )}

      {!isNotationLoading && hasErrors && (
        <ErrorsOuter>
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

          <ErroredSuggestedNotationsOuter>
            <SuggestedNotations
              skeleton={skeleton}
              srcNotationId={params.id!}
              onLoadStart={onSuggestedNotationsLoadStart}
              onLoadEnd={onSuggestedNotationsLoadEnd}
            />
          </ErroredSuggestedNotationsOuter>
        </ErrorsOuter>
      )}
    </FullHeightDiv>
  );
});

export default NotationShow;
