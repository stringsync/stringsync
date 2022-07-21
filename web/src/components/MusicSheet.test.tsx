import { render } from '@testing-library/react';
import React from 'react';
import { DisplayMode } from '../lib/musicxml';
import { Test } from '../testing';
import { MusicSheet } from './MusicSheet';

describe('MusicSheet', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <MusicSheet displayMode={DisplayMode.NotesAndTabs} notation={null} />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
