import { MusicXML } from '@stringsync/musicxml';
import { DrawingParametersEnum } from 'opensheetmusicdisplay';
import { useEffect, useState } from 'react';
import { useDevice } from '../ctx/device';
import { useMemoCmp } from '../hooks/useMemoCmp';
import { MusicDisplay, OpenSheetMusicDisplay } from '../lib/MusicDisplay';
import { NoopMusicDisplay } from '../lib/MusicDisplay/NoopMusicDisplay';
import { DisplayMode } from '../lib/musicxml';
import { withDisplayMode } from '../lib/musicxml/withDisplayMode';
import * as notations from '../lib/notations';
import { Nullable } from '../util/types';

export type UseMusicDisplayOpts = {
  musicXml: Nullable<MusicXML>;
  deadTimeMs: number;
  durationMs: number;
  musicDisplayContainer: Nullable<HTMLDivElement>;
  scrollContainer: Nullable<HTMLDivElement>;
  displayMode: DisplayMode;
};

export const useMusicDisplay = (opts: UseMusicDisplayOpts): [MusicDisplay, boolean] => {
  opts = useMemoCmp(opts);

  const [loading, setLoading] = useState(true);
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

    const isTabsOnly = opts.displayMode === DisplayMode.TabsOnly;

    const musicDisplay = new OpenSheetMusicDisplay(opts.musicDisplayContainer, {
      syncSettings: { deadTimeMs: opts.deadTimeMs, durationMs: opts.durationMs },
      svgSettings: { eventNames: notations.getSvgEventNames(device) },
      scrollContainer: opts.scrollContainer,
      drawKeySignatures: !isTabsOnly,
      drawTimeSignatures: !isTabsOnly,
      drawStartClefs: !isTabsOnly,
      drawMeasureNumbers: !isTabsOnly,
      drawMetronomeMarks: !isTabsOnly,
      drawingParameters: DrawingParametersEnum.default,
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

    const musicXml = withDisplayMode(opts.musicXml, opts.displayMode);
    musicDisplay.load(musicXml);

    return () => {
      setMusicDisplay(new NoopMusicDisplay());
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
      musicDisplay.dispose();
    };
  }, [opts, device]);

  return [musicDisplay, loading];
};
