import { Alert, Row } from 'antd';

type Props = {
  errors: string[];
};

export const Errors: React.FC<Props> = (props) => {
  return (
    <Row justify="center">
      <Alert
        showIcon
        type="error"
        message="error"
        description={
          <>
            {props.errors.map((error, ndx) => (
              <div key={ndx}>{error}</div>
            ))}
          </>
        }
      />
    </Row>
  );
};
