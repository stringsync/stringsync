import { MusicXML } from '@stringsync/musicxml';
import { DrawingParametersEnum } from 'opensheetmusicdisplay';
import { useEffect, useState } from 'react';
import { useDevice } from '../../../ctx/device';
import { useMemoCmp } from '../../../hooks/useMemoCmp';
import { MusicDisplay, OpenSheetMusicDisplay } from '../../../lib/MusicDisplay';
import { NoopMusicDisplay } from '../../../lib/MusicDisplay/NoopMusicDisplay';
import { Nullable } from '../../../util/types';
import * as helpers from '../helpers';

export type UseMusicDisplayOpts = {
  musicXml: Nullable<MusicXML>;
  deadTimeMs: number;
  durationMs: number;
  musicDisplayContainer: Nullable<HTMLDivElement>;
  scrollContainer: Nullable<HTMLDivElement>;
};

export const useMusicDisplay = (opts: UseMusicDisplayOpts): [MusicDisplay, boolean] => {
  opts = useMemoCmp(opts);

  const [loading, setLoading] = useState(false);
  const [musicDisplay, setMusicDisplay] = useState<MusicDisplay>(() => new NoopMusicDisplay());
  const device = useDevice();

  useEffect(() => {
    if (!opts.musicXml) {
      return;
    }
    if (!opts.musicDisplayContainer) {
      return;
    }
    if (!opts.scrollContainer) {
      return;
    }

    const musicDisplay = new OpenSheetMusicDisplay(opts.musicDisplayContainer, {
      syncSettings: { deadTimeMs: opts.deadTimeMs, durationMs: opts.durationMs },
      svgSettings: { eventNames: helpers.getSvgEventNames(device) },
      scrollContainer: opts.scrollContainer,
      drawingParameters: device.mobile ? DrawingParametersEnum.compacttight : DrawingParametersEnum.default,
    });
    setMusicDisplay(musicDisplay);

    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

    const eventBusIds = [
      musicDisplay.eventBus.subscribe('loadstarted', startLoading),
      musicDisplay.eventBus.subscribe('loadended', stopLoading),
      musicDisplay.eventBus.subscribe('resizestarted', startLoading),
      musicDisplay.eventBus.subscribe('resizeended', stopLoading),
    ];

    musicDisplay.load(opts.musicXml);

    return () => {
      setMusicDisplay(new NoopMusicDisplay());
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
      musicDisplay.dispose();
    };
  }, [opts, device]);

  return [musicDisplay, loading];
};
