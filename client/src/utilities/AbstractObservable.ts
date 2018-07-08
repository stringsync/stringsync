/**
 * This class provides the subject end of the subject-observer pattern. It is up to the
 * implementing class to call AbstractSubject.prototype.notify and set the changed
 * variable to true.
 */
export abstract class AbstractObservable {
  public observers: IObserver[] = [];
  public changed: boolean = false;

  /**
   * Adds the observer to the subject.
   * 
   * @param observer
   */
  public subscribe(observer: IObserver): void {
    this.observers.push(observer);
  }

  /**
   * Removes the observer from the subject.
   * 
   * @param observer 
   */
  public unsubscribe(observer: IObserver): void {
    this.observers = this.observers.filter(subbedObserver => subbedObserver !== observer);
  }

  /**
   * Iterates through the observers in the order that they were subscribed
   * and calls AbstractObserver.prototype.handleNotification on each of
   * them passing this in.
   * 
   * Does nothing if the changed state is false.
   */
  protected notify(): void {
    if (this.changed) {
      this.observers.forEach(observer => observer.handleNotification(this));
    }
    
    this.changed = false;
  }
}
