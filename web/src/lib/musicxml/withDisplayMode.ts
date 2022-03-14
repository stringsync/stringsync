import { MusicXML, MusicXMLRoot } from '@stringsync/musicxml';
import { DisplayMode } from './types';

export const withDisplayMode = <T extends MusicXMLRoot>(
  musicXml: MusicXML<T>,
  displayMode: DisplayMode
): MusicXML<T> => {
  switch (displayMode) {
    case DisplayMode.NotesAndTabs:
      return showNotesAndTabs(musicXml) as MusicXML<T>;
    case DisplayMode.TabsOnly:
      return showTabsOnly(musicXml) as MusicXML<T>;
    case DisplayMode.NotesOnly:
      return showNotesOnly(musicXml) as MusicXML<T>;
  }
};

const showNotesAndTabs = (musicXml: MusicXML): MusicXML => {
  return musicXml;
};

const showTabsOnly = (musicXml: MusicXML): MusicXML => {
  return musicXml;
};

const showNotesOnly = (musicXml: MusicXML): MusicXML => {
  return musicXml;
};
