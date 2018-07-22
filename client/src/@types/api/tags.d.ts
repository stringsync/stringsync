namespace API {
  namespace Tags {
    export interface IAsIncluded {
      type: 'tags';
      id: number;
      attributes: {
        name: string;
        links: JSONApi.ILinks;
      }
    }

    export interface IIdentifier extends JSONApi.IIdentifier {
      type: 'tags';
      id: number;
    }

    export interface IData extends IIdentifier {
      attributes: {
        name: string;
      }
    }

    export interface IIndexResponse {
      links: JSONApi.ILinks;
      data: IData[];
    }
  }
}