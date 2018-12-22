import { Flow } from 'vextab/releases/vextab-div.js';

// BASIC CONVERSIONS

// s <=> ms
export const msToS = (ms: number): number => ms / 1000;
export const sToMs = (s: number): number => s * 1000;

// s <=> min
export const sToMin = (s: number): number => s / 60;
export const minToS = (min: number): number => min * 60;

// ms <=> min
export const msToMin = (ms: number): number => sToMin(msToS(ms));
export const minToMs = (min: number): number => sToMs(minToS(min));

// TICK CONVERSIONS

// bpm <=> tpm
export const bpmToTpm = (bpm: number): number => bpm * Flow.RESOLUTION / 4;
export const tpmToBpm = (tpm: number): number => tpm * 4 / Flow.RESOLUTION;

// min <=> tick
export const minToTick = (min: number, bpm: number): number => min * bpmToTpm(bpm);
export const tickToMin = (tick: number, bpm: number): number => tick / bpmToTpm(bpm);

// s <=> tick
export const sToTick = (s: number, bpm: number): number => minToTick(sToMin(s), bpm);
export const tickToS = (tick: number, bpm: number): number => minToS(tickToMin(tick, bpm));

// ms <=> tick
export const msToTick = (ms: number, bpm: number): number => sToTick(msToS(ms), bpm);
export const tickToMs = (tick: number, bpm: number): number => sToMs(tickToS(tick, bpm));
