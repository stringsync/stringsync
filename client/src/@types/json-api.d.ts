declare namespace JSONApi {
  export interface IIdentifier {
    id: number;
    type: string;
  }

  export interface ILinks {
    self?: string;
    related?: string | object;
    meta?: object;
  }

  export interface IIncluded {
    id: number;
    type: string;
    attributes: object;
  }

  export interface IData {
    attributes?: object;
    relationships?: object;
    links: ILinksObject;
  }
}