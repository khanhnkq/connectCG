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
export class UserProfile {
  http;
  constructor(http) {
    this.http = http;
  }
  /**
   * No description
   *
   * @tags UserProfile
   * @name UserprofileUpdateAvatar
   * @request POST:/api/v1/users/avatar
   * @secure
   */
  userprofileUpdateAvatar = (data, params = {}) =>
    this.http.request({
      path: `/api/v1/users/avatar`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags UserProfile
   * @name UserprofileUpdateCover
   * @request POST:/api/v1/users/cover
   * @secure
   */
  userprofileUpdateCover = (data, params = {}) =>
    this.http.request({
      path: `/api/v1/users/cover`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags UserProfile
   * @name UserprofileGetUserProfile
   * @request GET:/api/v1/users/{userId}/profile
   * @secure
   */
  userprofileGetUserProfile = ({ userId }, params = {}) =>
    this.http.request({
      path: `/api/v1/users/${userId}/profile`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags UserProfile
   * @name UserprofileSearchMembers
   * @request GET:/api/v1/users/search
   * @secure
   */
  userprofileSearchMembers = (query, params = {}) =>
    this.http.request({
      path: `/api/v1/users/search`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags UserProfile
   * @name UserprofileUpdateProfileInfo
   * @request PUT:/api/v1/users/profile
   * @secure
   */
  userprofileUpdateProfileInfo = (data, params = {}) =>
    this.http.request({
      path: `/api/v1/users/profile`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags UserProfile
   * @name UserprofileUpdateUserHobbies
   * @request PUT:/api/v1/users/hobbies
   * @secure
   */
  userprofileUpdateUserHobbies = (data, params = {}) =>
    this.http.request({
      path: `/api/v1/users/hobbies`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
