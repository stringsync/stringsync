declare namespace API {
  namespace Base {
    export interface IResponse {
      data?: any[];
      included?: JSONApi.IIncludedObject[];
      links?: JSONApi.ILinksObject;
    }
  }
}
