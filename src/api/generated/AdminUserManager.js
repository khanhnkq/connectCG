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

import { ContentType } from "./http-client";
export class AdminUserManager {
  http;
  constructor(http) {
    this.http = http;
  }
  /**
   * No description
   *
   * @tags AdminUserManager
   * @name AdminusermanagerGetAllUsers
   * @request GET:/api/v1/admin-user
   * @secure
   */
  adminusermanagerGetAllUsers = (query = {}, params = {}) =>
    this.http.request({
      path: `/api/v1/admin-user`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags AdminUserManager
   * @name AdminusermanagerUpdateRole
   * @request PATCH:/api/v1/admin-user/{userId}/role
   * @secure
   */
  adminusermanagerUpdateRole = ({ userId }, data, params = {}) =>
    this.http.request({
      path: `/api/v1/admin-user/${userId}/role`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags AdminUserManager
   * @name AdminusermanagerToggleLock
   * @request PATCH:/api/v1/admin-user/{userId}/lock
   * @secure
   */
  adminusermanagerToggleLock = ({ userId }, params = {}) =>
    this.http.request({
      path: `/api/v1/admin-user/${userId}/lock`,
      method: "PATCH",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags AdminUserManager
   * @name AdminusermanagerDeleteUser
   * @request PATCH:/api/v1/admin-user/{userId}/delete
   * @secure
   */
  adminusermanagerDeleteUser = ({ userId }, params = {}) =>
    this.http.request({
      path: `/api/v1/admin-user/${userId}/delete`,
      method: "PATCH",
      secure: true,
      ...params,
    });
}
