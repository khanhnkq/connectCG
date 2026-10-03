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
  FriendDTO,
  FriendrestGetFriendsByUserIdParams,
  FriendrestGetMyFriendsParams,
  FriendrestUnfriendParams,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export declare class FriendRest<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;
  constructor(http: HttpClient<SecurityDataType>);
  /**
   * No description
   *
   * @tags FriendRest
   * @name FriendrestGetFriendsByUserId
   * @request GET:/api/v1/friends/{userId}
   * @secure
   */
  friendrestGetFriendsByUserId: (
    { userId, ...query }: FriendrestGetFriendsByUserIdParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<FriendDTO>>;
  /**
   * No description
   *
   * @tags FriendRest
   * @name FriendrestGetMyFriends
   * @request GET:/api/v1/friends/my-friends
   * @secure
   */
  friendrestGetMyFriends: (
    query?: FriendrestGetMyFriendsParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<FriendDTO>>;
  /**
   * No description
   *
   * @tags FriendRest
   * @name FriendrestUnfriend
   * @request DELETE:/api/v1/friends/{friendId}
   * @secure
   */
  friendrestUnfriend: (
    { friendId }: FriendrestUnfriendParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
}
