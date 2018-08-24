declare namespace Store {
  export interface IState {
    editor: IEditorState;
    notations: Notation.INotation[];
    notation: Notation.INotation;
    session: ISessionState;
    tags: Tag.ITag[];
    ui: IUiState;
    video: IVideoState;
    viewport: IViewportState;
  }

  export interface ISessionState {
    signedIn: boolean;
    email: string;
    uid: string;
    id: number;
    image: string | null;
    name: string;
    provider: SessionProviders;
    role: Role.Roles;
  }

  export interface IVideoState {
    kind: Video.Kinds | null;
    src: string;
    player: Youtube.IPlayer | null;
    playerState?: Youtube.IPlayerStates;
    isActive?: boolean;
  }

  export interface IViewportState {
    type: ViewportTypes;
    width: number;
  }

  export interface IUiState {
    isNotationMenuVisible: boolean;
    isLoopVisible: boolean;
    isFretboardVisible: boolean;
    isPianoVisible: boolean;
  }

  export interface IEditorState {
    enabled: boolean;
    elementIndex: number;
    errors: string[];
    lastRenderedAt: number;
    vextab: Vextab | null;
  }
}
