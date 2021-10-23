import { DrawingParametersEnum } from 'opensheetmusicdisplay';
import { useEffect, useState } from 'react';
import { useDevice } from '../../../ctx/device';
import { MusicDisplay, OpenSheetMusicDisplay } from '../../../lib/MusicDisplay';
import { NoopMusicDisplay } from '../../../lib/MusicDisplay/NoopMusicDisplay';
import { Nullable } from '../../../util/types';
import * as helpers from '../helpers';
import { RenderableNotation } from '../types';

export const useMusicDisplay = (
  notation: Nullable<RenderableNotation>,
  musicDisplayContainer: Nullable<HTMLDivElement>,
  scrollContainer: Nullable<HTMLDivElement>
): [MusicDisplay, boolean] => {
  const [loading, setLoading] = useState(false);
  const [musicDisplay, setMusicDisplay] = useState<MusicDisplay>(() => new NoopMusicDisplay());
  const device = useDevice();

  useEffect(() => {
    if (!notation) {
      return;
    }
    if (!notation.musicXmlUrl) {
      return;
    }
    if (!musicDisplayContainer) {
      return;
    }
    if (!scrollContainer) {
      return;
    }

    const musicDisplay = new OpenSheetMusicDisplay(musicDisplayContainer, {
      syncSettings: { deadTimeMs: notation.deadTimeMs, durationMs: notation.durationMs },
      svgSettings: { eventNames: helpers.getSvgEventNames(device) },
      scrollContainer,
      drawingParameters: device.mobile ? DrawingParametersEnum.compacttight : DrawingParametersEnum.default,
    });
    setMusicDisplay(musicDisplay);
    (window as any).md = musicDisplay;

    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

    const eventBusIds = [
      musicDisplay.eventBus.subscribe('loadstarted', startLoading),
      musicDisplay.eventBus.subscribe('loadended', stopLoading),
      musicDisplay.eventBus.subscribe('resizestarted', startLoading),
      musicDisplay.eventBus.subscribe('resizeended', stopLoading),
    ];

    musicDisplay.load(notation.musicXmlUrl);

    return () => {
      setMusicDisplay(new NoopMusicDisplay());
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
      musicDisplay.dispose();
    };
  }, [notation, device, musicDisplayContainer, scrollContainer]);

  return [musicDisplay, loading];
};
