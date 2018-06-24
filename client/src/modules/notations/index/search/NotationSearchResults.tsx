import * as React from 'react';
import sonarSearchSrc from 'assets/sonar-search.svg';
import styled from 'react-emotion';
import { compose, withProps } from 'recompose';

interface IOuterProps {
  queryString: string;
  queryTags: Set<string>;
  numQueriedNotations: number;
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
    const { numQueriedNotations } = props;
    const resultString = `${numQueriedNotations} ${numQueriedNotations === 1 ? 'result' : 'results'}`;
    return { resultString };
  }),
  /**
   * 0 results from a given queryString or number of queryTags is considered having results
   */
  withProps((props: any) => ({
    hasResults: props.queryString || props.queryTags.size > 0
  }))
)

const Results = styled('div')`
  text-align: center;
  margin: 24px 8px 0 8px;
  font-size: 24px;
`;

const SonarSearch = styled('img')`
  width: 65%;
`;

const RemoveFilter = styled('div')`
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
const NotationSearchResults = enhance(props => (
  <div>
    {
      props.hasResults
        ? <Results>
          <div>{props.resultString}</div>
          <RemoveFilter onClick={props.onClear}>remove filters</RemoveFilter>
          {
            props.numQueriedNotations === 0
              ? <SonarSearch src={sonarSearchSrc} alt="string-sync-logo" />
              : null
          }
        </Results>
        : null
    }
  </div>
));

export default NotationSearchResults;