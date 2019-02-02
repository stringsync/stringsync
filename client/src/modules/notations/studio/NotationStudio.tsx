import * as React from 'react';
import { Lane } from '../../../components/lane/Lane';
import { compose } from 'recompose';
import { RouteComponentProps } from 'react-router';
import { withNotation } from '../../../enhancers/withNotation';

type RouteProps = RouteComponentProps<{ id: string }>;

const noop = () => null;

const enhance = compose<RouteProps, RouteProps>(
  withNotation<RouteProps>(
    props => parseInt(props.match.params.id, 10),
    noop,
    props => {
      const notationId = props.match.params.id;
      window.ss.message.error(`could not load notation '${notationId}'`);
      props.history.push('/');
    },
    noop
  )
);

export const NotationStudio = enhance(() => (
  <Lane
    withTopMargin={true}
    withPadding={true}
  >
    <div>Video</div>
    <div>Fretboard</div>
    <div>Notation</div>
  </Lane>
));
