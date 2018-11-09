declare namespace API {
  namespace Base {
    export interface IResponse {
      data?: any;
      included?: JSONApi.IIncluded[];
      links?: JSONApi.ILinks;
    }
  }
}
