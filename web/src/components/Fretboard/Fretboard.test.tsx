import { render } from '@testing-library/react';
import { Scale } from '@tonaljs/tonal';
import React from 'react';
import { MergeStrategy } from '.';
import { Fretboard } from './Fretboard';
import * as testing from './testing';

describe('Fretboard', () => {
  it('renders without crashing', () => {
    const { container } = render(<Fretboard />);

    expect(container).toBeInTheDocument();
    expect(testing.getFretboardEl(container)).not.toBeNull();
    expect(container).toRenderNumPositions(0);
  });

  it('renders with a single position', () => {
    const { container } = render(
      <Fretboard>
        <Fretboard.Position fret={1} string={2} />
      </Fretboard>
    );

    expect(container).toBeInTheDocument();
    expect(container).toRenderNumPositions(1);
    expect(container).toRenderPosition({ fret: 1, string: 2 });
  });

  it('uses standard tuning by default', () => {
    const { container } = render(
      <Fretboard>
        <Fretboard.Position fret={0} string={1} />
        <Fretboard.Position fret={0} string={2} />
        <Fretboard.Position fret={0} string={3} />
        <Fretboard.Position fret={0} string={4} />
        <Fretboard.Position fret={0} string={5} />
        <Fretboard.Position fret={0} string={6} />
      </Fretboard>
    );

    expect(container).toBeInTheDocument();
    expect(container).toRenderNumPositions(6);
    expect(container).toRenderNoteTimes('E', 2);
    expect(container).toRenderNoteTimes('B', 1);
    expect(container).toRenderNoteTimes('G', 1);
    expect(container).toRenderNoteTimes('D', 1);
    expect(container).toRenderNoteTimes('A', 1);
  });

  it('renders with multiple distinct positions', () => {
    const { container } = render(
      <Fretboard>
        <Fretboard.Position fret={1} string={2} />
        <Fretboard.Position fret={3} string={4} />
      </Fretboard>
    );

    expect(container).toBeInTheDocument();
    expect(container).toRenderNumPositions(2);
    expect(container).toRenderPosition({ fret: 1, string: 2 });
    expect(container).toRenderPosition({ fret: 3, string: 4 });
  });

  it('ignores a sole null child', () => {
    const { container } = render(<Fretboard>{null}</Fretboard>);

    expect(container).toBeInTheDocument();
    expect(container).toRenderNumPositions(0);
  });

  it('ignores a null child rendered with a position', () => {
    const { container } = render(
      <Fretboard>
        <Fretboard.Position fret={1} string={2} />
        {null}
      </Fretboard>
    );

    expect(container).toBeInTheDocument();
    expect(testing.getAllPositionEls(container)).toHaveLength(1);
  });

  it('deduplicates positions', () => {
    const { container } = render(
      <Fretboard>
        <Fretboard.Position fret={1} string={2} />
        <Fretboard.Position fret={1} string={2} />
      </Fretboard>
    );

    expect(container).toBeInTheDocument();
    expect(container).toRenderNumPositions(1);
    expect(container).toRenderPosition({ fret: 1, string: 2 });
  });

  it.each(Scale.get('C major').notes)('renders C major scale with note: %s', (note) => {
    const { container } = render(
      <Fretboard>
        <Fretboard.Scale root="C" type="major" />
      </Fretboard>
    );

    expect(container).toBeInTheDocument();
    expect(testing.getPositionElsByNote(container, note).length).toBeGreaterThan(0);
  });

  it('renders non-overlapping positions and scales', () => {
    const { container } = render(
      <Fretboard>
        <Fretboard.Scale root="C" type="major" />
        <Fretboard.Position fret={9} string={6} />
      </Fretboard>
    );

    expect(container).toBeInTheDocument();
    expect(testing.getPositionEl(container, { fret: 9, string: 6 })).not.toBeNull();
  });

  it('renders overlapping positions and scales', () => {
    const { container } = render(
      <Fretboard>
        <Fretboard.Scale root="C" type="major" />
        <Fretboard.Position fret={8} string={6} />
      </Fretboard>
    );

    expect(container).toBeInTheDocument();
    expect(container).toRenderPosition({ fret: 8, string: 6 });
  });

  it('merges partial styles by default', () => {
    const { container } = render(
      <Fretboard>
        <Fretboard.Position fret={1} string={2} style={{ stroke: 'green' }} />
        <Fretboard.Position fret={1} string={2} style={{ fill: 'red' }} />
      </Fretboard>
    );

    expect(container).toBeInTheDocument();
    const style = testing.getStyleAtPosition(container, { fret: 1, string: 2 });
    expect(style).not.toBeNull();
    expect(style!.stroke).toBe('green');
    expect(style!.fill).toBe('red');
  });

  it('picks the last partial style when merging', () => {
    const { container } = render(
      <Fretboard styleMergeStrategy={MergeStrategy.Merge}>
        <Fretboard.Position fret={1} string={2} style={{ stroke: 'green', fill: 'lime' }} />
        <Fretboard.Position fret={1} string={2} style={{ fill: 'red' }} />
      </Fretboard>
    );

    expect(container).toBeInTheDocument();
    expect(container).toHavePositionStyle({ fret: 1, string: 2 }, 'fill', 'red');
    expect(container).toHavePositionStyle({ fret: 1, string: 2 }, 'stroke', 'green');
  });

  it('picks styles on a first seen basis', () => {
    const { container } = render(
      <Fretboard styleMergeStrategy={MergeStrategy.First}>
        <Fretboard.Position fret={1} string={2} style={{ stroke: 'green' }} />
        <Fretboard.Position fret={1} string={2} style={{ fill: 'red' }} />
      </Fretboard>
    );

    expect(container).toBeInTheDocument();
    expect(container).not.toHavePositionStyle({ fret: 1, string: 2 }, 'fill', 'red');
    expect(container).toHavePositionStyle({ fret: 1, string: 2 }, 'stroke', 'green');
  });

  it('picks styles on a last seen basis', () => {
    const { container } = render(
      <Fretboard styleMergeStrategy={MergeStrategy.Last}>
        <Fretboard.Position fret={1} string={2} style={{ stroke: 'green' }} />
        <Fretboard.Position fret={1} string={2} style={{ fill: 'red' }} />
      </Fretboard>
    );

    expect(container).toBeInTheDocument();
    expect(container).toHavePositionStyle({ fret: 1, string: 2 }, 'fill', 'red');
    expect(container).not.toHavePositionStyle({ fret: 1, string: 2 }, 'stroke', 'green');
  });
});
