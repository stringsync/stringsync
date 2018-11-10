import * as React from 'react';
import { INotation } from '../../../../@types/notation';
import { compose, withProps } from 'recompose';
import withSizes from 'react-sizes';
import { chunk } from 'lodash';
import { Details } from './details';
import styled from 'react-emotion';

interface IOuterProps {
  notations: INotation[];
  queryTags: string[];
  loading?: boolean;
}

interface ISizesProps extends IOuterProps {
  isMobile: boolean;
  isTablet: boolean;
}

interface IUiProps {
  notationRows: INotation[][];
  gutter: number;
  colSpan: number;
}

export type GridProps = ISizesProps & IUiProps;

const enhance = compose<GridProps, IOuterProps>(
  withSizes(size => ({
    isMobile: withSizes.isMobile(size),
    isTablet: withSizes.isTablet(size)
  })),
  withProps<IUiProps, ISizesProps>(props => {
    let notationsPerRow: number;
    let gutter: number;

    if (props.isMobile) {
      notationsPerRow = 1;
      gutter = 8;
    } else if (props.isTablet) {
      notationsPerRow = 2;
      gutter = 16;
    } else {
      notationsPerRow = 3;
      gutter = 36;
    }

    return {
      colSpan: Math.floor(24 / notationsPerRow),
      gutter,
      notationRows: chunk(props.notations, notationsPerRow)
    };
  })
);

const Outer = styled('div')`
  margin: 48px 0 0 0;
`;

export const Grid = enhance(props => (
  <Outer>
    <Details {...props} />
  </Outer>
));
