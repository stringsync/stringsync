import * as React from 'react';
import styled from 'react-emotion';
import { compose, withProps, branch, renderNothing } from 'recompose';
import { SonarSearch } from './SonarSearch';

interface IOuterProps {
  queryString: string;
  queryTags: Set<string>;
  numFound: number;
  onClear: () => void;
}

interface IInnerProps extends IOuterProps {
  resultString: string;
  hasResults: boolean;
}

const enhance = compose<IInnerProps, IOuterProps>(
  /**
   * The resultString is the message that shows when a queryString or at least one queryTag
   * is selected.
   */
  withProps((props: any) => {
    const { numFound } = props;
    const resultString = `${numFound} ${numFound === 1 ? 'result' : 'results'}`;
    return { resultString };
  }),
  /**
   * 0 results from a given queryString or number of queryTags is considered having results
   */
  withProps((props: any) => ({
    hasResults: props.queryString || props.queryTags.size > 0
  })),
  branch((props: IInnerProps) => !props.hasResults, renderNothing)
)

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
  color: ${props => props.theme.primaryColor};

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
    <SonarSearch hidden={props.numFound > 0} />
  </Inner>
));
