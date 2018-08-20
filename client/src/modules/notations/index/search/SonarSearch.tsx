import * as React from 'react';
import { compose, branch, renderNothing } from 'recompose';
import sonarSearchSrc from 'assets/sonar-search.svg';
import styled from 'react-emotion';

interface IOuterProps {
  hidden: boolean;
}

const enhance = compose<IOuterProps, IOuterProps>(
  branch<IOuterProps>(props => props.hidden, renderNothing)
);

const StyledImg = styled('img')`
  width: 65%;
`;

export const SonarSearch = enhance(() => <StyledImg src={sonarSearchSrc} alt="string-sync-logo" />);
