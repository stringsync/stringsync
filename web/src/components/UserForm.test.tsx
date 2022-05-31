import { render } from '@testing-library/react';
import React from 'react';
import { UserRole } from '../lib/graphql';
import { Test } from '../testing';
import { UserForm } from './UserForm';

describe('UserForm', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <UserForm
          user={{
            id: 'id',
            createdAt: new Date(),
            email: 'email@domain.tld',
            role: UserRole.STUDENT,
            username: 'foobar',
          }}
        />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
