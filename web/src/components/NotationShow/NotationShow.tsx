import React, { useCallback } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import { useDevice } from '../../ctx/device';
import { useViewport } from '../../ctx/viewport/useViewport';
import { Layout, withLayout } from '../../hocs/withLayout';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useMemoCmp } from '../../hooks/useMemoCmp';
import { useNoOverflow } from '../../hooks/useNoOverflow';
import { useNotation } from '../../hooks/useNotation';
import { compose } from '../../util/compose';
import { FretMarkerDisplay, Notation, NotationLayoutOptions, NotationSettings } from '../Notation';
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
// support because it's the in-browser choice for a lot of apps.
const Outer = styled.div`
  height: 101vh;
`;

const enhance = compose(withLayout(Layout.NONE, { lanes: false, footer: false }));

const NotationShow: React.FC = enhance(() => {
  // layout
  const device = useDevice();
  const { xs, sm, md } = useViewport();
  const ltLg = xs || sm || md;
  const layoutOptions = device.mobile || ltLg ? MOBILE_NOTATION_LAYOUT_OPTIONS : DEFAULT_NOTATION_LAYOUT_OPTIONS;

  // notation
  const params = useParams<{ id: string }>();
  const [notation, errors, loading] = useNotation(params.id);

  // css effects
  useNoOverflow(document.body);

  // settings
  const initialDefaultSettings = useMemoCmp<PersistentSettings>({
    preferredLayout: 'sidecar',
    isVideoVisible: true,
    isFretboardVisible: !device.mobile,
    isAutoscrollPreferred: true,
    fretMarkerDisplay: FretMarkerDisplay.None,
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
      });
    },
    [setDefaultSettings]
  );

  return (
    <Outer data-testid="notation-show">
      <Notation
        loading={loading}
        notation={notation}
        layoutOptions={layoutOptions}
        defaultSettings={defaultSettings}
        onSettingsChange={onSettingsChange}
      />
    </Outer>
  );
});

export default NotationShow;
