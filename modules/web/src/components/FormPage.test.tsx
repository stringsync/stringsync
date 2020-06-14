import React from 'react';
import { render } from '@testing-library/react';
import { Test } from '../testing';
import { FormPage } from './FormPage';

const Dummy: React.FC = () => <div></div>;

it('renders without crashing', () => {
  const { container } = render(
    <Test>
      <FormPage main={<Dummy />} />
    </Test>
  );
  expect(container).toBeInTheDocument();
});
