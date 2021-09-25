import { render } from '@testing-library/react';
import { Test } from '../../testing';
import { NotFound } from './NotFound';

describe('NotFound', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <NotFound />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
