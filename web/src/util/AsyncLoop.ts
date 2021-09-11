type Callback = () => void;

export class AsyncLoop {
  private handle = -1;
  private isRunning = false;
  private callback: Callback;

  constructor(callback: Callback) {
    this.callback = callback;
  }

  start() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    this.iterate();
  }

  stop() {
    window.cancelAnimationFrame(this.handle);
    this.isRunning = false;
  }

  private iterate = () => {
    this.callback();
    this.handle = window.requestAnimationFrame(this.iterate);
  };
}
