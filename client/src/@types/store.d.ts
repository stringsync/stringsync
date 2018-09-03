declare namespace Store {
  export interface IState {
    editor: IEditorState;
    maestro: IMaestroState;
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
    focusedScrollElement: string | null;
  }

  export interface IEditorState {
    autosave: boolean;
    enabled: boolean;
    elementIndex: number;
    errors: string[];
    lastRenderedAt: number;
    lastUpdatedAt: number;
  }
  
  // The optional parameters facilitate the UPDATE action
  export interface IMaestroState {
    currentTimeMs?: number;
    vextab?: Vextab | null;
  }
}
