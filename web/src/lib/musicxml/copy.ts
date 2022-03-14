import { MusicXML, MusicXMLRoot } from '@stringsync/musicxml';

export const copy = <T extends MusicXMLRoot>(musicXml: MusicXML<T>): MusicXML<T> => {
  return MusicXML.parse(musicXml.serialize()) as MusicXML<T>;
};
