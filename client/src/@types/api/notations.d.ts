// import { ILinks } from '../json-api';

// declare namespace API {
//   namespace Notations {
//     export interface IDataRelationships {
//       tags: {
//         data: API.Tags.IIdentifier;
//       };
//       transcriber: {
//         data: API.Users.IIdentifier;
//       };
//       video: {
//         data: API.Videos.IIdentifier;
//       };
//     }

//     export interface IDataAttributes {
//       created_at: string;
//       updated_at: string;
//       song_name: string;
//       artist_name: string;
//       thumbnail_url: string;
//       duration_ms: number;
//       dead_time_ms: number;
//       bpm: number;
//       featured: boolean;
//       vextab_string: string;
//     }

//     export interface IData {
//       attributes: IDataAttributes;
//       id: number;
//       links: ILinks;
//       relationships: IDataRelationships;
//     }

//     export interface IIndexResponse extends API.Base.IResponse {
//       data: IData[];
//       included: Array<API.Users.IAsIncluded | API.Tags.IAsIncluded>;
//     }

//     export interface IShowResponse extends API.Base.IResponse {
//       data: IData;
//       included: Array<API.Videos.IAsIncluded | API.Users.IAsIncluded | API.Tags.IAsIncluded>;
//     }
//   }
// }
