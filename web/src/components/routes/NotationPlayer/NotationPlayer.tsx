import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Col, Row } from 'antd';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { $queries, NotationObject } from '../../../graphql';
import { Layout, withLayout } from '../../../hocs';
import { useEffectOnce } from '../../../hooks';
import { compose } from '../../../util/compose';
import { Video } from '../../Video';

const LoadingIcon = styled(LoadingOutlined)`
  font-size: 5em;
  color: ${(props) => props.theme['@border-color']};
`;

const enhance = compose(withLayout(Layout.DEFAULT_LANELESS));

interface Props {}

const NotationPlayer: React.FC<Props> = enhance(() => {
  const params = useParams<{ id: string }>();
  const [notation, setNotation] = useState<NotationObject | null>(null);
  const [errors, setErrors] = useState(new Array<string>());
  const [isLoading, setIsLoading] = useState(true);

  const hasErrors = errors.length > 0;

  useEffectOnce(() => {
    (async () => {
      const { data, errors } = await $queries.notation({ id: params.id });
      if (errors) {
        setErrors(errors.map((error) => error.message));
      } else if (!data?.notation) {
        setErrors([`no notation found with id '${params.id}'`]);
      } else {
        setNotation(data.notation);
      }
      setIsLoading(false);
    })();
  });

  return (
    <div data-testid="notation-player">
      {isLoading && (
        <>
          <br />
          <br />
          <Row justify="center">
            <LoadingIcon />
          </Row>
        </>
      )}

      {!isLoading && hasErrors && (
        <>
          <br />
          <br />
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
                  <Link to="/library">go to library</Link>
                </>
              }
            />
          </Row>
        </>
      )}

      {!isLoading && !hasErrors && notation && (
        <Row>
          <Col>
            <Video
              playerOptions={{
                sources: [
                  {
                    src: notation?.videoUrl || '',
                    type: 'application/x-mpegURL',
                  },
                ],
              }}
            />
            <div>comments</div>
          </Col>
          <Col>
            <div>notation</div>
          </Col>
        </Row>
      )}
    </div>
  );
});

export default NotationPlayer;
