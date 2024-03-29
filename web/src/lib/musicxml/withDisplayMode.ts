import { asserts, elements, MusicXML, MusicXMLRoot } from '@stringsync/musicxml';
import { copy } from './copy';
import { DisplayMode } from './types';

export const withDisplayMode = <T extends MusicXMLRoot>(
  musicXml: MusicXML<T>,
  displayMode: DisplayMode
): MusicXML<T> => {
  const musicXmlCopy = copy(musicXml);
  switch (displayMode) {
    case DisplayMode.TabsOnly:
      showTabsOnly(musicXmlCopy);
      break;
    case DisplayMode.NotesOnly:
      showNotesOnly(musicXmlCopy);
      break;
  }
  return musicXmlCopy;
};

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

    // filter non TAB <clef>
    const nextClefs = attributes.getClefs().filter((clef) => clef.getNumber() === tabClefNumber);
    attributes.setClefs(nextClefs);

    // filter <staff-details>
    const nextStaffDetails = attributes
      .getStaffDetails()
      .filter((staffDetail) => staffDetail.getNumber() === tabClefNumber);
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
    note.setBeams([]);
  }

  // remove <slur> elements from notations
  for (const note of notes) {
    const notations = note.getNotations();
    for (const notation of notations) {
      notation.setValues(notation.getValues().filter((value) => !asserts.isSlur(value)));
    }
  }

  // remove <note> elements without tabs
  const measures = getMeasures(musicXml);
  for (const measure of measures) {
    const nextMeasureValues = measure.getValues().filter((value) => {
      if (asserts.isNote(value)) {
        const note = value;

        // keep rests
        const variation = note.getVariation();
        if (asserts.isTiedNote(variation) && asserts.isRest(variation[1])) {
          return true;
        } else if (asserts.isCuedNote(variation) && asserts.isRest(variation[2])) {
          return true;
        } else if (asserts.isTiedGraceNote(variation) && asserts.isRest(variation[2])) {
          return true;
        } else if (asserts.isCuedGraceNote(variation) && asserts.isRest(variation[3])) {
          return true;
        }

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

const showNotesOnly = (musicXml: MusicXML) => {
  const attributesList = getAttributes(musicXml);
  for (const attributes of attributesList) {
    const staves = attributes.getStaves();
    if (!staves) {
      continue;
    }
    staves.setValue(staves.getValue() - 1);

    const tabClef = attributes.getClefs().find((clef) => clef.getSign().getClefSign() === 'TAB');
    if (!tabClef) {
      continue;
    }
    const tabClefNumber = tabClef.getNumber();
    if (tabClefNumber === null) {
      throw new Error('expected all tab clefs to have a number');
    }

    // filter TAB <clef>
    const nextClefs = attributes.getClefs().filter((clef) => clef.getNumber() !== tabClefNumber);
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
  }

  // remove <note> elements with a <technical>
  const measures = getMeasures(musicXml);
  for (const measure of measures) {
    const nextMeasureValues = measure.getValues().filter((value) => {
      if (asserts.isNote(value)) {
        const note = value;
        return !note.getNotations().some((notation) =>
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
