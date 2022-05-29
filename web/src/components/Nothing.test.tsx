import { render } from '@testing-library/react';
import { Nothing } from './Nothing';

describe('Nothing', () => {
  it('renders without crashing', () => {
    const { container } = render(<Nothing />);
    expect(container).toBeInTheDocument();
  });
});
