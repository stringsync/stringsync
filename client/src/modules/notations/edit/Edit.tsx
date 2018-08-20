import * as React from 'react';
import { compose, lifecycle } from 'recompose';
import { RouteComponentProps } from 'react-router';
import { ViewportTypes } from 'data/viewport/getViewportType';
import { connect } from 'react-redux';

type OuterProps = RouteComponentProps<{ id: string }>;

interface IConnectProps extends OuterProps {
  notation: Notation.INotation;
  viewportWidth: number;
  viewportType: ViewportTypes;
}

interface IInnerProps extends IConnectProps {

}

const enhance = compose<IInnerProps, OuterProps>(
);

export const Edit = enhance(props => (
  <div>
    {props.match.params.id}
  </div>
));
