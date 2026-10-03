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

export class OnlineStatus {
  http;
  constructor(http) {
    this.http = http;
  }
  /**
   * No description
   *
   * @tags OnlineStatus
   * @name OnlinestatusGetOnlineUsers
   * @request GET:/api/v1/users/online
   * @secure
   */
  onlinestatusGetOnlineUsers = (params = {}) =>
    this.http.request({
      path: `/api/v1/users/online`,
      method: "GET",
      secure: true,
      ...params,
    });
}
