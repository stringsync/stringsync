namespace API {
  namespace Users {
    export interface IIdentifier extends JSONApi.IIdentifier {
      type: 'users';
      id: number;
    }

    export interface IData extends IIdentifier {
      attributes: {
        image: string | void;
        name: string;
        role: string;
        uid: string;
      }
    }

    export type IAsIncluded = IData;


    export interface IShowResponse {
      links: JSONApi.ILinks;
      data: IData;
    }
  }
}
