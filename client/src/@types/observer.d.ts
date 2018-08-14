declare interface IObserver {
  name: string;
  handleNotification(subject: AbstractObservable): void;
}
