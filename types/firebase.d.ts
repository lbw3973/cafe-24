export interface IStoreInfo {
  id: string;
  address: string;
  group: string;
  internet: string;
  latitude: string;
  longitude: string;
  name: string;
  number: string;
  parking: string;
  table: string;
  toilet: string;
  type: string;
}

export interface IReportInfo {
  address: string;
  group: string;
  internet: string;
  name: string;
  number: string;
  parking: string;
  table: string;
  toilet: string;
  type: string;
}

export interface IUserInfo {
  name: string;
  email: string;
  uid: string;
  fav: string[];
  admin: boolean;
}

export interface IUploadInfo {
  address: string;
  group: string;
  internet: string;
  latitude: string;
  longitude: string;
  name: string;
  number: string;
  parking: string;
  table: string;
  toilet: string;
  type: string;
}
