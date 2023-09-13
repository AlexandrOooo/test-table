export interface IVideoInfo {
  embed: string;
  link: string;
  text: string;
}
export interface IUser {
  name: string;
  age: number;
  online: boolean;
  registrations: string;
  photo?: string;
  action?: string;
  [key: string]: any;
}
export interface IGetHomePageData {
  video: IVideoInfo;
  users: IUser[];
}
export type TableFields = keyof IUser;
