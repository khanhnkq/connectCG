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
  AdminusermanagerDeleteUserParams,
  AdminusermanagerGetAllUsersParams,
  AdminusermanagerToggleLockParams,
  AdminusermanagerUpdateRoleParams,
  UserProfileDTO,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export declare class AdminUserManager<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;
  constructor(http: HttpClient<SecurityDataType>);
  /**
   * No description
   *
   * @tags AdminUserManager
   * @name AdminusermanagerGetAllUsers
   * @request GET:/api/v1/admin-user
   * @secure
   */
  adminusermanagerGetAllUsers: (
    query?: AdminusermanagerGetAllUsersParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<UserProfileDTO>>;
  /**
   * No description
   *
   * @tags AdminUserManager
   * @name AdminusermanagerUpdateRole
   * @request PATCH:/api/v1/admin-user/{userId}/role
   * @secure
   */
  adminusermanagerUpdateRole: (
    { userId }: AdminusermanagerUpdateRoleParams,
    data: any,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags AdminUserManager
   * @name AdminusermanagerToggleLock
   * @request PATCH:/api/v1/admin-user/{userId}/lock
   * @secure
   */
  adminusermanagerToggleLock: (
    { userId }: AdminusermanagerToggleLockParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags AdminUserManager
   * @name AdminusermanagerDeleteUser
   * @request PATCH:/api/v1/admin-user/{userId}/delete
   * @secure
   */
  adminusermanagerDeleteUser: (
    { userId }: AdminusermanagerDeleteUserParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
}
