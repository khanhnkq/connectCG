/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  MemberSearchResponse,
  UpdateProfileRequest,
  UserProfileDTO,
  UserprofileGetUserProfileParams,
  UserprofileSearchMembersParams,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export declare class UserProfile<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;
  constructor(http: HttpClient<SecurityDataType>);
  /**
   * No description
   *
   * @tags UserProfile
   * @name UserprofileUpdateAvatar
   * @request POST:/api/v1/users/avatar
   * @secure
   */
  userprofileUpdateAvatar: (
    data: any,
    params?: RequestParams,
  ) => Promise<AxiosResponse<UserProfileDTO>>;
  /**
   * No description
   *
   * @tags UserProfile
   * @name UserprofileUpdateCover
   * @request POST:/api/v1/users/cover
   * @secure
   */
  userprofileUpdateCover: (
    data: any,
    params?: RequestParams,
  ) => Promise<AxiosResponse<UserProfileDTO>>;
  /**
   * No description
   *
   * @tags UserProfile
   * @name UserprofileGetUserProfile
   * @request GET:/api/v1/users/{userId}/profile
   * @secure
   */
  userprofileGetUserProfile: (
    { userId }: UserprofileGetUserProfileParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<UserProfileDTO>>;
  /**
   * No description
   *
   * @tags UserProfile
   * @name UserprofileSearchMembers
   * @request GET:/api/v1/users/search
   * @secure
   */
  userprofileSearchMembers: (
    query: UserprofileSearchMembersParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<MemberSearchResponse>>;
  /**
   * No description
   *
   * @tags UserProfile
   * @name UserprofileUpdateProfileInfo
   * @request PUT:/api/v1/users/profile
   * @secure
   */
  userprofileUpdateProfileInfo: (
    data: UpdateProfileRequest,
    params?: RequestParams,
  ) => Promise<AxiosResponse<UserProfileDTO>>;
  /**
   * No description
   *
   * @tags UserProfile
   * @name UserprofileUpdateUserHobbies
   * @request PUT:/api/v1/users/hobbies
   * @secure
   */
  userprofileUpdateUserHobbies: (
    data: any,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
}
