import { Alert, Button, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDevice } from '../../ctx/device';
import { Layout, withLayout } from '../../hocs/withLayout';
import { useNoOverflow } from '../../hooks/useNoOverflow';
import { useNotation } from '../../hooks/useNotation';
import { useNoTouchAction } from '../../hooks/useNoTouchAction';
import { useNoTouchCallout } from '../../hooks/useNoTouchCallout';
import { useNoUserSelect } from '../../hooks/useNoUserSelect';
import { compose } from '../../util/compose';
import { Nullable } from '../../util/types';
import { FullHeightDiv } from '../FullHeightDiv';
import { Notation, NotationLayoutOptions, RenderableNotation } from '../Notation';
import { EditSettings } from './EditSettings';

const LAYOUT_OPTIONS: NotationLayoutOptions = {
  permitted: ['sidecar'],
  target: 'sidecar',
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const ErrorsOuter = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 24px;
`;

const enhance = compose(withLayout(Layout.NONE));

const NotationEdit: React.FC = enhance(() => {
  const device = useDevice();

  // notation
  const [notation, setNotation] = useState<Nullable<RenderableNotation>>(null);
  const params = useParams<{ id: string }>();
  const [fetchedNotation, errors, loading] = useNotation(params.id);
  const hasErrors = errors.length > 0;
  useEffect(() => {
    if (!fetchedNotation) {
      return;
    }
    // only overwrite notation if it hasn't been fetched yet
    setNotation((notation) => (notation ? notation : fetchedNotation));
  }, [fetchedNotation]);

  // css effects
  useNoOverflow(hasErrors ? null : document.body);
  useNoUserSelect(document.body);
  useNoTouchAction(document.body);
  useNoTouchCallout(document.body);

  return (
    <FullHeightDiv data-testid="notation-edit">
      {device.mobile && (
        <Overlay>
          <h2>Editing is not supported on mobile</h2>
          <Link to={`/n/${params.id}`}>
            <Button type="link">go to notation player</Button>
          </Link>
        </Overlay>
      )}

      {!hasErrors && (
        <Notation
          loading={loading}
          notation={fetchedNotation}
          sidecar={notation && <EditSettings notation={notation} onNotationUpdate={setNotation} />}
          layoutOptions={LAYOUT_OPTIONS}
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
        </ErrorsOuter>
      )}
    </FullHeightDiv>
  );
});

export default NotationEdit;
