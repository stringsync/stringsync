import React from 'react';
import sonarSleepSrc from 'assets/sonar-sleep.svg';
import sonarGuitarSrc from 'assets/sonar-guitar.svg';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';

const getRandomSrc = () => Math.random() > 0.5 ? sonarSleepSrc : sonarGuitarSrc;

const Outer = styled('div')`
  text-align: center;
  margin-top: 24px;
`;

const Sonar = styled('img')`
  width: 65%;
`;

const NotFound = () => (
  <Outer>
    <Sonar src={getRandomSrc()} alt="Not Found" />
    <h1>page not found</h1>
    <Link to="/">home</Link>
  </Outer>
);

export default NotFound;
