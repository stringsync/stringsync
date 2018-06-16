declare namespace StringSync {
  export interface StoreState {
    notations: INotationsState;
    session: ISessionState;
    tags: ITagsState;
    users: IUsersState;
    video: IVideoState;
    viewport: IViewportState;
  }
}
