declare interface IObserver {
  handleNotification(subject: AbstractObservable): void;
}
