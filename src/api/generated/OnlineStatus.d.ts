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

import { HttpClient, RequestParams } from "./http-client";
export declare class OnlineStatus<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;
  constructor(http: HttpClient<SecurityDataType>);
  /**
   * No description
   *
   * @tags OnlineStatus
   * @name OnlinestatusGetOnlineUsers
   * @request GET:/api/v1/users/online
   * @secure
   */
  onlinestatusGetOnlineUsers: (
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
}
