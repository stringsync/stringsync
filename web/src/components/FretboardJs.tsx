import { Key } from '@tonaljs/tonal';
import { get } from 'lodash';
import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { useFretboard } from '../hooks/useFretboard';
import { useGuitar } from '../hooks/useGuitar';
import { useStyleFilters } from '../hooks/useStyleFilters';
import { useStyleTargets } from '../hooks/useStyleTargets';
import * as fretboard from '../lib/fretboard';
import { Tuning } from '../lib/guitar/Tuning';

const DEFAULT_TONIC = 'C';
const DEFAULT_TUNING = Tuning.standard();
const DEFAULT_OPTIONS: fretboard.FretboardJsOptions = {};
const EXCEED_WIDTH_PX = 4;
const EXCEED_LEFT_PADDING_PX = 6;

type TieStyleTarget = fretboard.SlideStyleTarget | fretboard.HammerOnStyleTarget | fretboard.PullOffStyleTarget;

export type FretboardJsProps = PropsWithChildren<{
  options?: fretboard.FretboardJsOptions;
  tonic?: string;
  tuning?: Tuning;
  styleMergeStrategy?: fretboard.MergeStrategy;
  onResize?: (dimmensions: { width: number; height: number }) => void;
}>;

export type FretboardJsChildComponents = {
  Position: typeof fretboard.Position;
  Scale: typeof fretboard.Scale;
  Slide: typeof fretboard.Slide;
  HammerOn: typeof fretboard.HammerOn;
  PullOff: typeof fretboard.PullOff;
};

export const FretboardJs: React.FC<FretboardJsProps> & FretboardJsChildComponents = (props) => {
  const tonic = props.tonic || DEFAULT_TONIC;
  const options = props.options || DEFAULT_OPTIONS;
  const tuning = props.tuning || DEFAULT_TUNING;
  const styleMergeStrategy = props.styleMergeStrategy || fretboard.MergeStrategy.Merge;
  const figureRef = useRef<HTMLElement>(null);
  const onResize = props.onResize;

  const fb = useFretboard(figureRef, tuning, options);
  const guitar = useGuitar(tuning);
  const styleTargets = useStyleTargets(fb, props.children, styleMergeStrategy);
  const styleFilters = useStyleFilters(styleTargets.positions);

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) {
      return;
    }
    if (!onResize) {
      return;
    }
    const reseizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      onResize({ width, height });
    });
    reseizeObserver.observe(figure);
    return () => {
      reseizeObserver.disconnect();
    };
  }, [figureRef, onResize]);

  useEffect(() => {
    // All renderings must be done synchronously within this effect so that they are layered deterministically.
    // SVG elements do not have a z-index property.

    const maxFret = fb.positions[0].length - 1;
    const { font, dotSize, dotTextSize, width, leftPadding, rightPadding } = get(fb, 'options');
    const { positions } = fb;
    const getDotOffset = get(fb, 'getDotOffset', () => 0).bind(fb);
    const dotOffset = getDotOffset();
    const p = (string: number, fret: number) => positions[string - 1][fret - dotOffset];

    const tieOpacity = 0.3;
    const tieHeight = dotSize;
    const tieWidth = ({ string, frets }: TieStyleTarget) => {
      return `${Math.abs(p(string, frets[0]).x - p(string, frets[1]).x)}%`;
    };
    const tieX = ({ string, frets }: TieStyleTarget) => `${p(string, Math.min(...frets)).x}%`;
    const tieY = ({ string, frets }: TieStyleTarget) => {
      return p(string, Math.min(...frets)).y - tieHeight * 0.5;
    };
    const tieFill = ({ style }: TieStyleTarget) => style.fill;
    const tieStroke = ({ style }: TieStyleTarget) => style.stroke;
    const tieFontSize = Math.max(8, dotTextSize - 4);

    // ----------------
    // render slides
    // ----------------

    const slideGroup = fb.wrapper
      .append('g')
      .attr('class', 'slides')
      .attr('font-family', font)
      .selectAll('g')
      .data(styleTargets.slides.filter((styleTarget) => styleTarget.frets.every((fret) => fret < maxFret)))
      .enter()
      .append('g')
      .attr('class', ({ string, frets }: fretboard.SlideStyleTarget) => {
        return ['slide', `slide-string-${string}-from-fret-${frets[0]}-to-fret-${frets[1]}`].join(' ');
      });
    slideGroup
      .append('rect')
      .attr('class', 'slide-rect')
      .attr('x', tieX)
      .attr('y', tieY)
      .attr('width', tieWidth)
      .attr('height', tieHeight)
      .attr('fill', tieFill)
      .attr('stroke', tieStroke)
      .attr('opacity', tieOpacity);
    slideGroup
      .append('text')
      .attr('class', 'slide-text')
      .text('S')
      .attr('font-size', tieFontSize)
      .attr('x', (styleTarget: fretboard.HammerOnStyleTarget) => {
        let x1 = p(styleTarget.string, styleTarget.frets[0]).x;
        let x2 = p(styleTarget.string, styleTarget.frets[1]).x;
        [x1, x2] = [x1, x2].sort();
        return `${x1 + (x2 - x1) / 2}%`;
      })
      .attr('y', (styleTarget: fretboard.HammerOnStyleTarget) => {
        return tieY(styleTarget) + tieHeight / 2 - 4;
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle');

    // -------------------
    // render hammer-ons
    // -------------------

    const hammerOnGroup = fb.wrapper
      .append('g')
      .attr('class', 'hammer-ons')
      .selectAll('g')
      .data(styleTargets.hammerOns.filter((styleTarget) => styleTarget.frets.every((fret) => fret < maxFret)))
      .enter()
      .append('g')
      .attr('class', ({ string, frets }: fretboard.HammerOnStyleTarget) => {
        return ['hammer-on', `hammer-on-string-${string}-from-fret-${frets[0]}-to-fret-${frets[1]}`];
      });
    hammerOnGroup
      .append('rect')
      .attr('class', 'hammer-on-rect')
      .attr('x', tieX)
      .attr('y', tieY)
      .attr('width', tieWidth)
      .attr('height', tieHeight)
      .attr('fill', tieFill)
      .attr('stroke', tieStroke)
      .attr('opacity', tieOpacity);
    hammerOnGroup
      .append('text')
      .attr('class', 'hammer-on-text')
      .text('H')
      .attr('font-size', tieFontSize)
      .attr('x', (styleTarget: fretboard.HammerOnStyleTarget) => {
        let x1 = p(styleTarget.string, styleTarget.frets[0]).x;
        let x2 = p(styleTarget.string, styleTarget.frets[1]).x;
        [x1, x2] = [x1, x2].sort();
        return `${x1 + (x2 - x1) / 2}%`;
      })
      .attr('y', (styleTarget: fretboard.HammerOnStyleTarget) => {
        return tieY(styleTarget) + tieHeight / 2 - 4;
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle');

    // -------------------
    // render pull-offs
    // -------------------

    const pullOffsGroup = fb.wrapper
      .append('g')
      .attr('class', 'pull-offs')
      .selectAll('g')
      .data(styleTargets.pullOffs.filter((styleTarget) => styleTarget.frets.every((fret) => fret < maxFret)))
      .enter()
      .append('g')
      .attr('class', ({ string, frets }: fretboard.PullOffStyleTarget) => {
        return ['pull-offs', `pull-off-string-${string}-from-fret-${frets[0]}-to-fret-${frets[1]}`];
      });
    pullOffsGroup
      .append('rect')
      .attr('class', 'pull-off-rect')
      .attr('x', tieX)
      .attr('y', tieY)
      .attr('width', tieWidth)
      .attr('height', tieHeight)
      .attr('fill', tieFill)
      .attr('stroke', tieStroke)
      .attr('opacity', tieOpacity);
    pullOffsGroup
      .append('text')
      .attr('class', 'pull-off-text')
      .text('P')
      .attr('font-size', tieFontSize)
      .attr('x', (styleTarget: fretboard.PullOffStyleTarget) => {
        let x1 = p(styleTarget.string, styleTarget.frets[0]).x;
        let x2 = p(styleTarget.string, styleTarget.frets[1]).x;
        [x1, x2] = [x1, x2].sort();
        return `${x1 + (x2 - x1) / 2}%`;
      })
      .attr('y', (styleTarget: fretboard.PullOffStyleTarget) => {
        return tieY(styleTarget) + tieHeight / 2 - 4;
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle');

    // ----------------
    // render positions
    // ----------------
    const gradesByNote = fretboard.getGradesByNote(tonic);
    const key = Key.majorKey(tonic);
    const scale = new Set(key.scale);

    fb.setDots(
      styleTargets.positions
        .filter((styleTarget) => styleTarget.position.fret <= maxFret)
        .map<fretboard.PositionFilterParams>((styleTarget) => {
          const pitch = guitar.getPitchAt(styleTarget.position);
          const enharmonic1 = pitch.toString();
          const enharmonic2 = fretboard.getEnharmonic(enharmonic1);
          const hasEnharmonic = enharmonic1 !== enharmonic2;
          const isKeySharp = key.alteration > 0;
          const isKeyFlat = key.alteration < 0;
          const isKeyNatural = key.alteration === 0;

          let note: string;
          if (!hasEnharmonic) {
            note = enharmonic1;
          } else if (scale.has(enharmonic1)) {
            note = enharmonic1;
          } else if (scale.has(enharmonic2)) {
            note = enharmonic2;
          } else if (isKeySharp) {
            note = [enharmonic1, enharmonic2].find((enharmonic) => enharmonic.includes('#')) || '';
          } else if (isKeyFlat) {
            note = [enharmonic1, enharmonic2].find((enharmonic) => enharmonic.includes('b')) || '';
          } else if (isKeyNatural) {
            note = [enharmonic1, enharmonic2].find((enharmonic) => enharmonic.length === 1) || '';
          } else {
            note = enharmonic1;
          }

          return {
            fret: styleTarget.position.fret,
            string: styleTarget.position.string,
            note,
            grade: gradesByNote[note],
            octave: pitch.octave,
          };
        })
    );

    // ----------------
    // render exceeds
    // ----------------

    // https://github.com/moonwave99/fretboard.js/blob/118a38a3a487cc488cd1de49759b210d9ff14323/src/fretboard/utils.ts#L141
    const totalWidth = width + leftPadding + rightPadding;

    fb.wrapper
      .append('g')
      .attr('class', 'exceeds')
      .selectAll('g')
      .data(styleTargets.positions.filter((styleTarget) => styleTarget.position.fret > maxFret))
      .enter()
      .append('g')
      .attr('class', ({ position }: fretboard.PositionStyleTarget) => {
        return `exceed exceed-string-${position.string}-fret-${position.fret}`;
      })
      .append('rect')
      .attr('class', 'exceed-rect')
      .attr('width', EXCEED_WIDTH_PX)
      .attr('height', dotSize)
      .attr('x', totalWidth + EXCEED_LEFT_PADDING_PX)
      .attr('y', ({ position }: fretboard.PositionStyleTarget) => p(position.string, maxFret).y - dotSize * 0.5)
      .attr('fill', ({ style }: fretboard.PositionStyleTarget) => style.fill)
      .attr('stroke', ({ style }: fretboard.PositionStyleTarget) => style.stroke);

    fb.render();

    styleFilters.forEach((styleFilter) => {
      fb.style({ filter: styleFilter.predicate, ...styleFilter.style });
    });

    return () => {
      fb.wrapper.select('.slides').remove();
      fb.wrapper.select('.hammer-ons').remove();
      fb.wrapper.select('.pull-offs').remove();
      fb.wrapper.select('.exceeds').remove();
    };
  }, [fb, guitar, styleFilters, tonic, styleTargets]);

  return <figure ref={figureRef} />;
};

FretboardJs.Position = fretboard.Position;
FretboardJs.Scale = fretboard.Scale;
FretboardJs.Slide = fretboard.Slide;
FretboardJs.HammerOn = fretboard.HammerOn;
FretboardJs.PullOff = fretboard.PullOff;
