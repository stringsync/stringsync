import * as React from 'react';
import { compose, withProps, branch, renderNothing } from 'recompose';
import { SonarSearch } from './SonarSearch';
import styled from 'react-emotion';

interface IProps {
  queryString: string;
  queryTags: string[];
  numQueried: number;
  onClear: () => void;
}

interface IInnerProps extends IProps {
  resultString: string;
  hasResults: boolean;
}

const enhance = compose<IInnerProps, IProps>(
  /**
   * The resultString is the message that shows when a queryString or at least one queryTag
   * is selected.
   */
  withProps((props: any) => {
    const { numQueried } = props;
    const resultString = `${numQueried} ${numQueried === 1 ? 'result' : 'results'}`;
    return { resultString };
  }),
  /**
   * 0 results from a given queryString or number of queryTags is considered having results
   */
  withProps((props: any) => ({
    hasResults: props.queryString || props.queryTags.length > 0
  })),
  branch((props: IInnerProps) => !props.hasResults, renderNothing)
);

const Inner = styled('div')`
  text-align: center;
  margin: 24px 8px 0 8px;
  font-size: 24px;
`;

const Clear = styled('div')`
  margin: 0 auto;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  color: ${props => props.theme['@primary-color']};
  &:hover {
    text-decoration: underline;
  }
`;

/**
 * This component displays the number of results for the NotationIndex component
 */
export const Results = enhance(props => (
  <Inner>
    <div>{props.resultString}</div>
    <Clear onClick={props.onClear}>remove filters</Clear>
    <SonarSearch hidden={props.numQueried > 0} />
  </Inner>
));
