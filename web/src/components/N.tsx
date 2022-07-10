import { Alert, Row } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useNotation } from '../hooks/useNotation';
import { FullHeightDiv } from './FullHeightDiv';
import { SuggestedNotations } from './SuggestedNotations';

const Errors = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
`;

export const N: React.FC = () => {
  const params = useParams();
  const notationId = params.id || '';
  const [notation, errors, loading] = useNotation(notationId);
  const showErrors = !loading && errors.length > 0;
  const showNotation = !loading && errors.length === 0;

  return (
    <FullHeightDiv>
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
