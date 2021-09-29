export type ServiceWorkerState = {
  isInitialized: boolean;
  isUpdated: boolean;
  registration: ServiceWorkerRegistration | null;
};
