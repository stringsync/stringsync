import * as React from 'react';
import { compose, lifecycle } from 'recompose';

const enhance = compose(
  lifecycle({
    componentDidMount(): void {

    }
  })
);

export const NotationShow = enhance(() => <div>NotationShow</div>);
