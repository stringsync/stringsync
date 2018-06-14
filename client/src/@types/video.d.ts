declare namespace Video {
  type Kinds = 'YOUTUBE'

  export interface IVideo {
    kind: Kinds;
    src: string;
  }
}
