import { ACTIVE_STATUS } from "./settings";

export const DEFAULT_CHAT_PROPS = {
  createdAt: new Date(),
  status: ACTIVE_STATUS,
};

export enum UserRole {
  "DEFAULT" = 0,
  "ADMIN" = 1,
}

export enum ChatType {
  PUBLIC_TYPE = 1,
  PRIVATE_TYPE = 2,
}
