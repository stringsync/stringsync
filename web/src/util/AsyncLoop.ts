type Callback = () => void;

type Raf = (callback: () => void) => number;

type Caf = (handle: number) => void;

export class AsyncLoop {
  private handle = -1;
  private isRunning = false;
  private callback: Callback;
  private raf: Raf;
  private caf: Caf;

  constructor(callback: Callback, raf: Raf = window.requestAnimationFrame, caf: Caf = window.cancelAnimationFrame) {
    this.callback = callback;
    this.raf = raf;
    this.caf = caf;
  }

  start() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    this.iterate();
  }

  stop() {
    this.caf(this.handle);
    this.isRunning = false;
  }

  private iterate = () => {
    this.callback();
    this.handle = this.raf(this.iterate);
  };
}
