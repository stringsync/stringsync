import { HomeOutlined, InfoCircleOutlined, SoundFilled, SoundOutlined } from '@ant-design/icons';
import { Button, Drawer, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../ctx/auth';
import { useDevice } from '../ctx/device';
import { useViewport } from '../ctx/viewport';
import { Layout, withLayout } from '../hocs/withLayout';
import { useMute } from '../hooks/useMute';
import { useNoOverflow } from '../hooks/useNoOverflow';
import { useNotation } from '../hooks/useNotation';
import { useNotationSettings } from '../hooks/useNotationSettings';
import { useNoTouchAction } from '../hooks/useNoTouchAction';
import { useNoTouchCallout } from '../hooks/useNoTouchCallout';
import { useNoUserSelect } from '../hooks/useNoUserSelect';
import { UserRole } from '../lib/graphql';
import { MediaPlayer, NoopMediaPlayer } from '../lib/MediaPlayer';
import * as notations from '../lib/notations';
import { compose } from '../util/compose';
import { Errors } from './Errors';
import { FullHeightDiv } from './FullHeightDiv';
import { NotationInfo } from './NotationInfo';
import { NotationPlayer } from './NotationPlayer';
import { SplitPaneLayoutType } from './SplitPaneLayout';
import { SuggestedNotations } from './SuggestedNotations';

const Outer = styled(FullHeightDiv)`
  background: white;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const FloatingButton = styled(Button)<{ $top: number }>`
  position: fixed;
  top: ${(props) => props.$top}px;
  right: -1px;
  z-index: 6;
`;

const ErrorsOuter = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
`;

const Flex1 = styled.div`
  overflow: hidden;
  flex: 1;
  height: 100%;
`;

const Flex1InvisibleScrollbar = styled(Flex1)`
  margin: 16px;
  overflow-y: auto;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const SpacedButton = styled(Button)`
  margin-top: 8px;
`;

const MobileLandscapeWarning: React.FC = () => {
  return (
    <Overlay>
      <h2>
        Mobile landscape mode is not supported <em>yet</em>.
      </h2>
    </Overlay>
  );
};

const Sidecar: React.FC<{
  notation: notations.RenderableNotation;
  notationId: string;
  editable: boolean;
  exportable: boolean;
}> = (props) => {
  const { notation, notationId, editable, exportable } = props;

  return (
    <Flex1InvisibleScrollbar>
      <br />
      <NotationInfo notation={notation} />
      <br />
      <div>
        {editable && (
          <Link to={`/n/${notationId}/edit`}>
            <SpacedButton block type="default" size="large">
              edit
            </SpacedButton>
          </Link>
        )}

        {exportable && (
          <Link to={`/n/${notationId}/export`}>
            <SpacedButton block type="default" size="large">
              export
            </SpacedButton>
          </Link>
        )}

        <SuggestedNotations srcNotationId={notationId} />
      </div>
    </Flex1InvisibleScrollbar>
  );
};

const enhance = compose(withLayout(Layout.NONE, { footer: false, lanes: false }));

export const N: React.FC = enhance(() => {
  // notation
  const params = useParams();
  const notationId = params.id || '';
  const [notation, errors, loading] = useNotation(notationId);
  const hasErrors = errors.length > 0;

  // auth
  const [authState] = useAuth();
  const isAdmin = authState.user.role === UserRole.ADMIN;
  const isTranscriber = authState.user.id === notation?.transcriber.id;
  const exportable = isAdmin;
  const editable = isTranscriber || isAdmin;

  // dimensions
  const device = useDevice();
  const viewport = useViewport();

  // settings
  const [notationSettings, setNotationSettings] = useNotationSettings();

  // layout
  const [layoutType, setLayoutType] = useState<SplitPaneLayoutType>('sidecar');

  // navigation
  const navigate = useNavigate();
  const onHomeClick = () => navigate('/library');

  // mute
  const [mediaPlayer, setMediaPlayer] = useState<MediaPlayer>(() => new NoopMediaPlayer());
  const [muted, toggleMute] = useMute(mediaPlayer);

  // sidecar drawer
  const [isSidecarDrawerVisible, setSidecarDrawerVisibility] = useState(false);
  const onSidecarDrawerToggle = () => setSidecarDrawerVisibility((isSidecarDrawerVisible) => !isSidecarDrawerVisible);
  const onSidecarDrawerClose = () => setSidecarDrawerVisibility(false);
  useEffect(() => {
    if (layoutType !== 'theater') {
      setSidecarDrawerVisibility(false);
    }
  }, [layoutType]);

  // css effects
  useNoOverflow(hasErrors ? null : document.body);
  useNoUserSelect(document.body);
  useNoTouchAction(document.body);
  useNoTouchCallout(document.body);

  // render branches
  const renderMobileLandscapeWarning = device.mobile && viewport.innerHeight < viewport.innerWidth;
  const renderErrors = !loading && hasErrors;
  const renderNotationPlayer = !loading && !hasErrors && notation;
  const renderDrawer = layoutType === 'theater' && notation;
  const renderFloatingButtons = layoutType === 'theater';

  return (
    <Outer data-testid="n">
      {renderMobileLandscapeWarning && <MobileLandscapeWarning />}

      {renderErrors && (
        <ErrorsOuter>
          <Errors errors={errors} />

          <br />

          <Row justify="center">
            <SuggestedNotations srcNotationId={notationId} />
          </Row>
        </ErrorsOuter>
      )}

      {renderDrawer && (
        <Drawer
          closable
          visible={isSidecarDrawerVisible}
          mask={false}
          width="100%"
          onClose={onSidecarDrawerClose}
          getContainer={false}
        >
          <Sidecar notation={notation} notationId={notationId} editable={editable} exportable={exportable} />
        </Drawer>
      )}

      {renderNotationPlayer && (
        <NotationPlayer
          notation={notation}
          notationSettings={notationSettings}
          setNotationSettings={setNotationSettings}
          sidecar={<Sidecar notation={notation} notationId={notationId} editable={editable} exportable={exportable} />}
          onLayoutTypeChange={setLayoutType}
          onMediaPlayerChange={setMediaPlayer}
        />
      )}

      {renderFloatingButtons && (
        <>
          <FloatingButton $top={16} size="large" type="primary" icon={<HomeOutlined />} onClick={onHomeClick} />
          <FloatingButton
            $top={72}
            size="large"
            type="primary"
            icon={<InfoCircleOutlined />}
            onClick={onSidecarDrawerToggle}
          />
          <FloatingButton
            $top={128}
            size="large"
            type="primary"
            icon={muted ? <SoundOutlined /> : <SoundFilled />}
            onClick={toggleMute}
          />
        </>
      )}
    </Outer>
  );
});

export default N;
