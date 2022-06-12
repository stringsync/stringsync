import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { Detail } from './Detail';

describe('Detail', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <Detail artistName="foo" songName="bar" thumbnailUrl="http://example.com/images" />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
