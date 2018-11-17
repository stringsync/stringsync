import * as React from 'react';
import { compose, withState } from 'recompose';
import { RouteComponentProps } from 'react-router';
import { Loading } from '../../../components/loading/Loading';
import { withNotation } from '../../../enhancers/withNotation';

interface IStateProps extends RouteComponentProps<{ id: string }> {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const enhance = compose<IStateProps, RouteComponentProps> (
  withState('loading', 'setLoading', true),
  withNotation<IStateProps>(
    props => parseInt(props.match.params.id, 10),
    props => props.setLoading(false),
    props => props.history.push('/')
  )
);

export const NotationShow = enhance(props => (
  <div>
    <Loading loading={props.loading} />
    <div>NotationShow</div>
  </div>
));
