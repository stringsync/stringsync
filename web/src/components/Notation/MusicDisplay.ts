import { merge } from 'lodash';
import { CursorType, DrawingParametersEnum, IOSMDOptions, OpenSheetMusicDisplay } from 'opensheetmusicdisplay';

type Callback = () => void;

type Options = IOSMDOptions & {
  onLoadStart?: Callback;
  onLoadEnd?: Callback;
  onResizeStart?: Callback;
  onResizeEnd?: Callback;
};

const noop = () => {};

const DEFAULT_OPTS: Options = {
  autoResize: true,
  backend: 'svg',
  drawTitle: false,
  drawSubtitle: false,
  drawingParameters: DrawingParametersEnum.default,
  drawPartNames: false,
  followCursor: true,
  pageBackgroundColor: 'white',
  cursorsOptions: [
    {
      type: CursorType.Standard,
      color: 'blue',
      follow: true,
      alpha: 0.25,
    },
    {
      type: CursorType.Standard,
      color: 'lime',
      follow: true,
      alpha: 0.25,
    },
  ],
};

export class MusicDisplay extends OpenSheetMusicDisplay {
  onLoadStart: Callback;
  onLoadEnd: Callback;

  constructor(container: string | HTMLElement, opts: Options) {
    super(container, merge({}, DEFAULT_OPTS, opts));

    this.onLoadStart = opts.onLoadStart || noop;
    this.onLoadEnd = opts.onLoadEnd || noop;
    this.handleResize(opts.onResizeStart || noop, opts.onResizeEnd || noop);
  }

  async load(xmlUrl: string) {
    this.onLoadStart();
    try {
      return await super.load(xmlUrl);
    } finally {
      this.onLoadEnd();
    }
  }

  onResize(onResizeStart: Callback, onResizeEnd: Callback) {
    this.handleResize(onResizeStart, onResizeEnd);
  }

  render() {
    super.render();

    for (const cursor of this.cursors) {
      cursor.cursorElement.style.zIndex = '2';
      cursor.show();
    }
  }
}
