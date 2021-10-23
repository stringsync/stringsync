import { Alert, Row } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import { useDevice } from '../../ctx/device';
import { useViewport } from '../../ctx/viewport/useViewport';
import { Layout, withLayout } from '../../hocs/withLayout';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useMemoCmp } from '../../hooks/useMemoCmp';
import { useNoOverflow } from '../../hooks/useNoOverflow';
import { useNotation } from '../../hooks/useNotation';
import { useNoTouchAction } from '../../hooks/useNoTouchAction';
import { useNoTouchCallout } from '../../hooks/useNoTouchCallout';
import { useNoUserSelect } from '../../hooks/useNoUserSelect';
import { compose } from '../../util/compose';
import { scrollToTop } from '../../util/scrollToTop';
import { FretMarkerDisplay, Notation, NotationLayoutOptions, NotationSettings } from '../Notation';
import { SuggestedNotations } from './SuggestedNotations';
import { PersistentSettings } from './types';

const NOTATION_SHOW_SETTINGS_KEY = 'stringsync_notation_settings';

const DEFAULT_NOTATION_LAYOUT_OPTIONS: NotationLayoutOptions = {
  target: 'sidecar',
  permitted: ['theater', 'sidecar'],
};

const MOBILE_NOTATION_LAYOUT_OPTIONS: NotationLayoutOptions = {
  target: 'theater',
  permitted: ['theater'],
};

// On Safari, the address bar only hides when it's possible to scroll on the Y-axs and the user is scrolling towards the
// bottom. Therefore, we purposely add overflow-y, but the user should never see this in theory. Safari is important to
// support because it's the web viewer in iPhone apps, assumed to be a large portion of the user base.
const Outer = styled.div`
  height: 101vh;
`;

const LandscapeOverlay = styled.div`
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
  const [notation, errors, loading] = useNotation(params.id);
  const hasErrors = errors.length > 0;
  useEffect(() => {
    scrollToTop();
  }, [params.id]);

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
    fretMarkerDisplay: FretMarkerDisplay.None,
    defaultSidecarWidthPx: 500,
    defaultTheaterHeightPx: 200,
  });
  const [defaultSettings, setDefaultSettings] = useLocalStorage<PersistentSettings>(
    NOTATION_SHOW_SETTINGS_KEY,
    initialDefaultSettings
  );
  const onSettingsChange = useCallback(
    (settings: NotationSettings) => {
      setDefaultSettings({
        preferredLayout: settings.preferredLayout,
        isVideoVisible: settings.isVideoVisible,
        isFretboardVisible: settings.isFretboardVisible,
        isAutoscrollPreferred: settings.isAutoscrollPreferred,
        fretMarkerDisplay: settings.fretMarkerDisplay,
        defaultSidecarWidthPx: settings.defaultSidecarWidthPx,
        defaultTheaterHeightPx: settings.defaultTheaterHeightPx,
      });
    },
    [setDefaultSettings]
  );

  return (
    <Outer data-testid="notation-show">
      {isMobileLandscape && (
        <LandscapeOverlay>
          <h2>
            Mobile landscape mode is not supported <em>yet</em>.
          </h2>
        </LandscapeOverlay>
      )}

      {!hasErrors && (
        <Notation
          loading={loading}
          notation={notation}
          sidecar={<SuggestedNotations srcNotationId={params.id} />}
          layoutOptions={layoutOptions}
          defaultSettings={defaultSettings}
          onSettingsChange={onSettingsChange}
        />
      )}

      {!loading && hasErrors && (
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
            <SuggestedNotations srcNotationId={params.id} />
          </ErroredSuggestedNotationsOuter>
        </ErrorsOuter>
      )}
    </Outer>
  );
});

export default NotationShow;
