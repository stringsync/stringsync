import { render } from '@testing-library/react';
import { Scale } from '@tonaljs/tonal';
import React from 'react';
import * as fretboard from '../lib/fretboard';
import { FretboardJs } from './FretboardJs';

describe('Fretboard', () => {
  it('renders without crashing', () => {
    const { container } = render(<FretboardJs />);

    expect(container).toBeInTheDocument();
    expect(fretboard.getFretboardEl(container)).not.toBeNull();
    expect(container).toRenderNumPositions(0);
  });

  it('renders with a single position', () => {
    const { container } = render(
      <FretboardJs>
        <FretboardJs.Position fret={1} string={2} />
      </FretboardJs>
    );

    expect(container).toBeInTheDocument();
    expect(container).toRenderNumPositions(1);
    expect(container).toRenderPosition({ fret: 1, string: 2 });
  });

  it('uses standard tuning by default', () => {
    const { container } = render(
      <FretboardJs>
        <FretboardJs.Position fret={0} string={1} />
        <FretboardJs.Position fret={0} string={2} />
        <FretboardJs.Position fret={0} string={3} />
        <FretboardJs.Position fret={0} string={4} />
        <FretboardJs.Position fret={0} string={5} />
        <FretboardJs.Position fret={0} string={6} />
      </FretboardJs>
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
      <FretboardJs>
        <FretboardJs.Position fret={1} string={2} />
        <FretboardJs.Position fret={3} string={4} />
      </FretboardJs>
    );

    expect(container).toBeInTheDocument();
    expect(container).toRenderNumPositions(2);
    expect(container).toRenderPosition({ fret: 1, string: 2 });
    expect(container).toRenderPosition({ fret: 3, string: 4 });
  });

  it('ignores a sole null child', () => {
    const { container } = render(<FretboardJs>{null}</FretboardJs>);

    expect(container).toBeInTheDocument();
    expect(container).toRenderNumPositions(0);
  });

  it('ignores a null child rendered with a position', () => {
    const { container } = render(
      <FretboardJs>
        <FretboardJs.Position fret={1} string={2} />
        {null}
      </FretboardJs>
    );

    expect(container).toBeInTheDocument();
    expect(fretboard.getAllPositionEls(container)).toHaveLength(1);
  });

  it('deduplicates positions', () => {
    const { container } = render(
      <FretboardJs>
        <FretboardJs.Position fret={1} string={2} />
        <FretboardJs.Position fret={1} string={2} />
      </FretboardJs>
    );

    expect(container).toBeInTheDocument();
    expect(container).toRenderNumPositions(1);
    expect(container).toRenderPosition({ fret: 1, string: 2 });
  });

  it.each(Scale.get('C major').notes)('renders C major scale with note: %s', (note) => {
    const { container } = render(
      <FretboardJs>
        <FretboardJs.Scale name="C major" />
      </FretboardJs>
    );

    expect(container).toBeInTheDocument();
    expect(fretboard.getPositionElsByNote(container, note).length).toBeGreaterThan(0);
  });

  it('renders non-overlapping positions and scales', () => {
    const { container } = render(
      <FretboardJs>
        <FretboardJs.Scale name="C major" />
        <FretboardJs.Position fret={9} string={6} />
      </FretboardJs>
    );

    expect(container).toBeInTheDocument();
    expect(fretboard.getPositionEl(container, { fret: 9, string: 6 })).not.toBeNull();
  });

  it('renders overlapping positions and scales', () => {
    const { container } = render(
      <FretboardJs>
        <FretboardJs.Scale name="C major" />
        <FretboardJs.Position fret={8} string={6} />
      </FretboardJs>
    );

    expect(container).toBeInTheDocument();
    expect(container).toRenderPosition({ fret: 8, string: 6 });
  });

  it('merges partial styles by default', () => {
    const { container } = render(
      <FretboardJs>
        <FretboardJs.Position fret={1} string={2} style={{ stroke: 'green' }} />
        <FretboardJs.Position fret={1} string={2} style={{ fill: 'red' }} />
      </FretboardJs>
    );

    expect(container).toBeInTheDocument();
    const style = fretboard.getStyleAtPosition(container, { fret: 1, string: 2 });
    expect(style).not.toBeNull();
    expect(style!.stroke).toBe('green');
    expect(style!.fill).toBe('red');
  });

  it('picks the last partial style when merging', () => {
    const { container } = render(
      <FretboardJs styleMergeStrategy={fretboard.MergeStrategy.Merge}>
        <FretboardJs.Position fret={1} string={2} style={{ stroke: 'green', fill: 'lime' }} />
        <FretboardJs.Position fret={1} string={2} style={{ fill: 'red' }} />
      </FretboardJs>
    );

    expect(container).toBeInTheDocument();
    expect(container).toHavePositionStyle({ fret: 1, string: 2 }, 'fill', 'red');
    expect(container).toHavePositionStyle({ fret: 1, string: 2 }, 'stroke', 'green');
  });

  it('picks styles on a first seen basis', () => {
    const { container } = render(
      <FretboardJs styleMergeStrategy={fretboard.MergeStrategy.First}>
        <FretboardJs.Position fret={1} string={2} style={{ stroke: 'green' }} />
        <FretboardJs.Position fret={1} string={2} style={{ fill: 'red' }} />
      </FretboardJs>
    );

    expect(container).toBeInTheDocument();
    expect(container).not.toHavePositionStyle({ fret: 1, string: 2 }, 'fill', 'red');
    expect(container).toHavePositionStyle({ fret: 1, string: 2 }, 'stroke', 'green');
  });

  it('picks styles on a last seen basis', () => {
    const { container } = render(
      <FretboardJs styleMergeStrategy={fretboard.MergeStrategy.Last}>
        <FretboardJs.Position fret={1} string={2} style={{ stroke: 'green' }} />
        <FretboardJs.Position fret={1} string={2} style={{ fill: 'red' }} />
      </FretboardJs>
    );

    expect(container).toBeInTheDocument();
    expect(container).toHavePositionStyle({ fret: 1, string: 2 }, 'fill', 'red');
    expect(container).not.toHavePositionStyle({ fret: 1, string: 2 }, 'stroke', 'green');
  });
});
