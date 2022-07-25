import { useCallback, useEffect, useState } from 'react';
import { Duration } from '../util/Duration';

const STRINGSYNC_POPUP_TARGET = 'stringsync_popup';

type ExportNotation = (notationId: string, width: number, height: number) => void;

const features = (obj: Record<string, any>): string => {
  return Object.entries(obj)
    .map(([key, value]) => `${key}=${value}`)
    .join(',');
};

export const useNotationExporter = (): [exportNotation: ExportNotation, popup: Window | null] => {
  const [popup, setPopup] = useState<Window | null>(null);

  const exportNotation = useCallback<ExportNotation>((notationId: string, width: number, height: number) => {
    const popup = window.open(`/n/${notationId}`, STRINGSYNC_POPUP_TARGET, features({ popup: true, width, height }));
    setPopup(popup);
    popup?.focus();
  }, []);

  useEffect(() => {
    if (!popup) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (popup.closed) {
        setPopup(null);
        window.clearInterval(intervalId);
      }
    }, Duration.sec(1).ms);

    return () => {
      window.clearInterval(intervalId);

      try {
        popup.close();
      } catch (err) {
        console.error(`error while closing popup: ${err}`);
      }
    };
  }, [popup]);

  return [exportNotation, popup];
};
