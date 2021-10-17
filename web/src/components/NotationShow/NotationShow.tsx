import React from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import { useDevice } from '../../ctx/device';
import { useViewport } from '../../ctx/viewport/useViewport';
import { Layout, withLayout } from '../../hocs/withLayout';
import { useNoOverflow } from '../../hooks/useNoOverflow';
import { useNotation } from '../../hooks/useNotation';
import { useNoTouchAction } from '../../hooks/useNoTouchAction';
import { useNoTouchCallout } from '../../hooks/useNoTouchCallout';
import { useNoUserSelect } from '../../hooks/useNoUserSelect';
import { compose } from '../../util/compose';
import { Notation, NotationLayoutOptions } from '../Notation';

const MOBILE_NOTATION_LAYOUT: NotationLayoutOptions = {
  preferred: null,
  default: 'theater',
  permitted: ['theater'],
};

const DEFAULT_NOTATION_LAYOUT: NotationLayoutOptions = {
  preferred: null,
  default: 'sidecar',
  permitted: ['theater', 'sidecar'],
};

// On Safari, the address bar only hides when it's possible to scroll on the Y-axs and the user is scrolling towards the
// bottom. Therefore, we purposely add overflow-y, but the user should never see this in theory. Safari is important to
// support because it's the in-browser choice for a lot of apps.
const Outer = styled.div`
  height: 101vh;
`;

const enhance = compose(withLayout(Layout.NONE, { lanes: false, footer: false }));

const NotationShow: React.FC = enhance(() => {
  const device = useDevice();
  const { xs, sm, md } = useViewport();
  const ltLg = xs || sm || md;
  const layout = device.mobile || ltLg ? MOBILE_NOTATION_LAYOUT : DEFAULT_NOTATION_LAYOUT;

  const params = useParams<{ id: string }>();
  const [notation, errors, loading] = useNotation(params.id);

  useNoOverflow(document.body);
  useNoUserSelect(document.body);
  useNoTouchAction(document.body);
  useNoTouchCallout(document.body);

  return (
    <Outer data-testid="notation-show">
      <Notation loading={loading} video notation={notation} layout={layout} />
    </Outer>
  );
});

export default NotationShow;
