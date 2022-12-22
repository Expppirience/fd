import { instance } from "../../common/api/baseAPI";
import { IUser } from "../../common/models";
import { ResponseType } from "../../common/api/types";
export interface IUpdatedUserInfo {
  name: string;
  avatar: string;
}

export interface IUpdateUserResponse {
  updatedUser: IUser;
  error?: string;
}

const sendUpdateUserRequest = (model: IUpdatedUserInfo) => {
  return instance.put<ResponseType<IUpdateUserResponse>>("/auth/me", model);
};

export const profileAPI = {
  sendUpdateUserRequest,
};
