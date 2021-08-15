import { IOSMDOptions, OpenSheetMusicDisplay } from 'opensheetmusicdisplay';

type Callback = () => void;

type Options = IOSMDOptions & {
  onResizeStart?: Callback;
  onResizeEnd?: Callback;
};

const noop = () => {};

export class StringsyncOpenSheetMusicDisplay extends OpenSheetMusicDisplay {
  constructor(container: string | HTMLElement, opts: Options) {
    super(container, opts);

    this.handleResize(opts.onResizeStart || noop, opts.onResizeEnd || noop);
  }

  onResize(onResizeStart: Callback, onResizeEnd: Callback) {
    this.handleResize(onResizeStart, onResizeEnd);
  }
}
