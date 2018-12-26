import * as React from 'react';
import { compose } from 'recompose';
import { Checkbox } from 'antd';
import { connect } from 'react-redux';
import { INotation } from '../../../@types/notation';
import { IStore } from '../../../@types/store';

interface IProps {
  notation: INotation;
}

interface IDispatchProps {
  foo: () => void;
}

type InnerProps = IProps & IDispatchProps;

const enhance = compose<InnerProps, IProps>(
  connect<{}, IDispatchProps, {}, IStore>(
    null,

  )
);

export const FeaturedCheckbox = enhance(props => (
  <Checkbox
    checked={props.notation.featured}
  />
));
