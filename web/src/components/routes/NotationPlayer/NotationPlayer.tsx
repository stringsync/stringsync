import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { $queries, NotationObject } from '../../../graphql';
import { Layout, withLayout } from '../../../hocs';
import { RootState } from '../../../store';
import { compose } from '../../../util/compose';
import { Video } from '../../Video';
import { SuggestedNotations } from './SuggestedNotations';

const LoadingIcon = styled(LoadingOutlined)`
  font-size: 5em;
  color: ${(props) => props.theme['@border-color']};
`;

const RightBorder = styled.div<{ border: boolean }>`
  box-sizing: border-box;
  border-right: ${(props) => (props.border ? '1px' : '0')} solid ${(props) => props.theme['@border-color']};
`;

const LeftOrTopCol = styled(Col)``;

const RightOrBottomCol = styled(Col)`
  margin-top: 24px;
`;

const SongName = styled.h1`
  text-align: center;
  font-size: 2em;
  margin-bottom: 0;
`;

const ArtistName = styled.h2`
  text-align: center;
  font-size: 1.25em;
  margin-bottom: 4px;
`;

const TranscriberName = styled.h3`
  text-align: center;
  font-size: 1em;
  font-weight: normal;
  color: ${(props) => props.theme['@muted']};
`;

const enhance = compose(withLayout(Layout.DEFAULT_LANELESS));

interface Props {}

const NotationPlayer: React.FC<Props> = enhance(() => {
  const gtMd = useSelector<RootState, boolean>((state) => {
    const { lg, xl, xxl } = state.viewport;
    return lg || xl || xxl;
  });

  const params = useParams<{ id: string }>();
  const [notation, setNotation] = useState<NotationObject | null>(null);
  const [errors, setErrors] = useState(new Array<string>());
  const [isLoading, setIsLoading] = useState(true);

  const hasErrors = errors.length > 0;

  useEffect(() => {
    setErrors([]);
    setIsLoading(true);
    setNotation(null);
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
  }, [params.id]);

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

      {gtMd}

      {!isLoading && !hasErrors && notation && (
        <Row>
          <LeftOrTopCol xs={24} sm={24} md={24} lg={6} xl={6} xxl={8}>
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
            <RightBorder border={gtMd}>{gtMd && <SuggestedNotations srcNotationId={notation.id} />}</RightBorder>
          </LeftOrTopCol>
          <RightOrBottomCol xs={24} sm={24} md={24} lg={18} xl={18} xxl={16}>
            <SongName>{notation.songName}</SongName>
            <ArtistName>by {notation.artistName}</ArtistName>
            <TranscriberName>{notation.transcriber.username}</TranscriberName>
          </RightOrBottomCol>
        </Row>
      )}
    </div>
  );
});

export default NotationPlayer;
