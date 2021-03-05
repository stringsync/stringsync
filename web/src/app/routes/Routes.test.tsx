import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../../testing';
import { Routes } from './Routes';

describe('Routes', () => {
  fit('renders without crashing', () => {
    const { container } = render(
      <Test>
        <Routes />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
