import { asserts, elements, MusicXML, MusicXMLRoot } from '@stringsync/musicxml';
import { copy } from './copy';
import { DisplayMode } from './types';

export const withDisplayMode = <T extends MusicXMLRoot>(
  musicXml: MusicXML<T>,
  displayMode: DisplayMode
): MusicXML<T> => {
  const musicXmlCopy = copy(musicXml);
  switch (displayMode) {
    case DisplayMode.NotesAndTabs:
      showNotesAndTabs(musicXmlCopy);
      break;
    case DisplayMode.TabsOnly:
      showTabsOnly(musicXmlCopy);
      break;
    case DisplayMode.NotesOnly:
      showNotesOnly(musicXmlCopy);
      break;
  }
  return musicXmlCopy;
};

const showNotesAndTabs = (musicXml: MusicXML) => {};

const showTabsOnly = (musicXml: MusicXML) => {
  const attributesList = getAttributes(musicXml);
  for (const attributes of attributesList) {
    attributes.setStaves(null);

    const tabClef = attributes.getClefs().find((clef) => clef.getSign().getClefSign() === 'TAB');
    if (!tabClef) {
      continue;
    }
    const tabClefNumber = tabClef.getNumber();
    if (tabClefNumber === null) {
      throw new Error('expected all tab clefs to have a number');
    }

    // filter <clef>
    const nextClefs = attributes.getClefs().filter((clef) => clef.getNumber() === tabClefNumber);
    attributes.setClefs(nextClefs);

    // filter <staff-details>
    const nextStaffDetails = attributes
      .getStaffDetails()
      .filter((staffDetail) => staffDetail.getNumber() !== tabClefNumber);
    attributes.setStaffDetails(nextStaffDetails);

    // filter <transpose>
    const transpositions = attributes.getTranspositions();
    if (asserts.isTransposes(transpositions)) {
      const transposes = transpositions;
      const nextTransposes = transposes.filter((transpose) => transpose.getNumber() !== tabClefNumber);
      attributes.setTranspositions(nextTransposes);
    }

    // re-number the notations
    tabClef.setNumber(1);
    attributes.getStaffDetails().forEach((staffDetail) => staffDetail.setNumber(1));
  }

  const notes = getNotes(musicXml);
  for (const note of notes) {
    const variation = note.getVariation();

    // decrement octave
    if (asserts.isTiedNote(variation)) {
      const tiedNote = variation;
      if (asserts.isPitch(tiedNote[1])) {
        const pitch = tiedNote[1];
        const octave = pitch.getOctave();
        octave.setOctave(octave.getOctave() - 1);
      }
    }

    // remove <notehead>
    note.setNotehead(null);

    // remove <stem>
    note.setStem(null);

    // remove <staff>
    note.setStaff(null);
  }

  // remove <note> elements without a <technical>
  const measures = getMeasures(musicXml);
  for (const measure of measures) {
    const nextMeasureValues = measure.getValues().filter((value) => {
      if (asserts.isNote(value)) {
        const note = value;
        return note.getNotations().some((notation) =>
          notation
            .getValues()
            .filter(asserts.isTechnical)
            .some(
              (technical) =>
                technical.getValues().filter((value) => asserts.isFret(value) || asserts.isString(value)).length >= 2
            )
        );
      }
      return true;
    });
    measure.setValues(nextMeasureValues);
  }
};

const showNotesOnly = (musicXml: MusicXML) => {};

const getMeasures = (musicXml: MusicXML): elements.MeasurePartwise[] => {
  const root = musicXml.getRoot();
  if (!asserts.isScorePartwise(root)) {
    throw new Error('expected root to be <score-partwise> element');
  }
  return root.getParts().flatMap((part) => part.getMeasures());
};

const getAttributes = (musicXml: MusicXML) => {
  return getMeasures(musicXml).flatMap((measure) => measure.getValues().filter(asserts.isAttributes));
};

const getNotes = (musicXml: MusicXML) => {
  return getMeasures(musicXml)
    .flatMap((measure) => measure.getValues())
    .filter(asserts.isNote);
};
