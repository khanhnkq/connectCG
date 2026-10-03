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

export class FriendRest {
  http;
  constructor(http) {
    this.http = http;
  }
  /**
   * No description
   *
   * @tags FriendRest
   * @name FriendrestGetFriendsByUserId
   * @request GET:/api/v1/friends/{userId}
   * @secure
   */
  friendrestGetFriendsByUserId = ({ userId, ...query }, params = {}) =>
    this.http.request({
      path: `/api/v1/friends/${userId}`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags FriendRest
   * @name FriendrestGetMyFriends
   * @request GET:/api/v1/friends/my-friends
   * @secure
   */
  friendrestGetMyFriends = (query = {}, params = {}) =>
    this.http.request({
      path: `/api/v1/friends/my-friends`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags FriendRest
   * @name FriendrestUnfriend
   * @request DELETE:/api/v1/friends/{friendId}
   * @secure
   */
  friendrestUnfriend = ({ friendId }, params = {}) =>
    this.http.request({
      path: `/api/v1/friends/${friendId}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
}
