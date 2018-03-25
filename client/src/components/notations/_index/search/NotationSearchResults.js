import React from 'react';
import { compose, setPropTypes, setDisplayName } from 'recompose';
import styled from 'react-emotion';
import PropTypes from 'prop-types';
import sonarSearchSrc from 'assets/sonar-search.svg';

const enhance = compose(
  setDisplayName('NotationSearchResults'),
  setPropTypes({
    queryString: PropTypes.string.isRequired,
    queryTags: PropTypes.arrayOf(PropTypes.string).isRequired,
    numQueried: PropTypes.number.isRequired,
    onClear: PropTypes.func.isRequired
  })
)

const Results = styled('div') `
  text-align: center;
  margin-top: 24px;
  font-size: 24px;
`;

const SonarSearch = styled('img') `
  width: 50%;
`;

const RemoveFilter = styled('div') `
  margin: 0 auto;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  color: ${props => props.theme.primaryColor};

  &:hover {
    text-decoration: underline;
  }
`;

const NotationSearchResults = enhance(props => (
  <div>
    {
      props.queryString
        ? <Results>
          {props.numQueried} {`result${props.numQueried === 1 ? '' : 's'} for '${props.queryString}'`}
          <RemoveFilter onClick={props.onClear}>
            remove filter
              </RemoveFilter>
          {
            props.numQueried === 0
              ? <SonarSearch src={sonarSearchSrc} alt="StringSync logo" />
              : null
          }
        </Results>
        : null
    }
  </div>
));

export default NotationSearchResults;