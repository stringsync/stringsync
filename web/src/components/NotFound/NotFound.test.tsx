import { render } from '@testing-library/react';
import { NotFound } from './NotFound';

describe('NotFound', () => {
  it('renders without crashing', () => {
    const { container } = render(<NotFound />);
    expect(container).toBeInTheDocument();
  });
});
