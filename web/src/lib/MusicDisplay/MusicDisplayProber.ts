import { MusicDisplayProbeResult, VoicePointer } from '.';
import { AssociationStore } from './AssociationStore';
import { InternalMusicDisplay } from './InternalMusicDisplay';

export class MusicDisplayProber {
  private imd: InternalMusicDisplay;

  constructor(imd: InternalMusicDisplay) {
    this.imd = imd;
  }

  probe(): MusicDisplayProbeResult {
    const result = {
      associationStore: new AssociationStore(),
      voicePointers: new Array<VoicePointer>(),
    };

    return result;
  }
}
