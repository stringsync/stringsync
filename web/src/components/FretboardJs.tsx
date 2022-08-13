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
  const { positionStyleTargets, slideStyleTargets } = useStyleTargets(fb, props.children, styleMergeStrategy);
  const styleFilters = useStyleFilters(positionStyleTargets);

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

    // ----------------
    // render slides
    // ----------------
    const { font, dotSize, width, leftPadding, rightPadding } = get(fb, 'options');
    const { positions } = fb;
    const getDotOffset = get(fb, 'getDotOffset', () => 0).bind(fb);
    const dotOffset = getDotOffset();
    const p = (string: number, fret: number) => positions[string - 1][fret - dotOffset];

    const slideGroup = fb.wrapper.append('g').attr('class', 'slides').attr('font-family', font);

    const slidesNodes = slideGroup
      .selectAll('g')
      .data(slideStyleTargets.filter((styleTarget) => styleTarget.frets.every((fret) => fret < maxFret)))
      .enter()
      .append('g')
      .attr('class', ({ string, frets }: fretboard.SlideStyleTarget) => {
        return ['slide', `slide-string-${string}-from-fret-${frets[0]}-to-fret-${frets[1]}`].join(' ');
      });

    const slideOpacity = 0.5;
    const slideHeight = dotSize;
    const slideWidth = ({ string, frets }: fretboard.SlideStyleTarget) => {
      return `${Math.abs(p(string, frets[0]).x - p(string, frets[1]).x)}%`;
    };
    const slideX = ({ string, frets }: fretboard.SlideStyleTarget) => `${p(string, Math.min(...frets)).x}%`;
    const slideY = ({ string, frets }: fretboard.SlideStyleTarget) => {
      return p(string, Math.min(...frets)).y - slideHeight * 0.5;
    };
    const slideFill = ({ style }: fretboard.SlideStyleTarget) => style.fill;
    const slideStroke = ({ style }: fretboard.SlideStyleTarget) => style.stroke;

    slidesNodes
      .append('rect')
      .attr('class', 'slide-rect')
      .attr('x', slideX)
      .attr('y', slideY)
      .attr('width', slideWidth)
      .attr('height', slideHeight)
      .attr('fill', slideFill)
      .attr('stroke', slideStroke)
      .attr('opacity', slideOpacity);

    // ----------------
    // render positions
    // ----------------
    const gradesByNote = fretboard.getGradesByNote(tonic);
    const key = Key.majorKey(tonic);
    const scale = new Set(key.scale);

    fb.setDots(
      positionStyleTargets
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
      .data(positionStyleTargets.filter((styleTarget) => styleTarget.position.fret > maxFret))
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
      fb.wrapper.select('.exceeds').remove();
    };
  }, [fb, guitar, styleFilters, positionStyleTargets, slideStyleTargets, tonic]);

  return <figure ref={figureRef} />;
};

FretboardJs.Position = fretboard.Position;
FretboardJs.Scale = fretboard.Scale;
FretboardJs.Slide = fretboard.Slide;
