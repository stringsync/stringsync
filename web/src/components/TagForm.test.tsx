import { render } from '@testing-library/react';
import { noop } from 'lodash';
import React from 'react';
import { Tag } from '../domain';
import { TagCategory } from '../graphql';
import { Test } from '../testing';
import { TagForm } from './TagForm';

describe('TagForm', () => {
  it('renders without crashing', () => {
    const tag: Tag = {
      id: 'id',
      name: 'name',
      category: TagCategory.GENRE,
    };
    const { container } = render(
      <Test>
        <TagForm onCommit={noop} tag={tag} />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
