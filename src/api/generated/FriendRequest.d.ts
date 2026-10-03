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
  FriendrequestAcceptRequestParams,
  FriendrequestCancelRequestParams,
  FriendRequestDTO,
  FriendrequestGetPendingRequestsParams,
  FriendrequestRejectRequestParams,
  FriendrequestSendRequestParams,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export declare class FriendRequest<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;
  constructor(http: HttpClient<SecurityDataType>);
  /**
   * No description
   *
   * @tags FriendRequest
   * @name FriendrequestGetPendingRequests
   * @request GET:/api/v1/friend-requests
   * @secure
   */
  friendrequestGetPendingRequests: (
    query: FriendrequestGetPendingRequestsParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<FriendRequestDTO>>;
  /**
   * No description
   *
   * @tags FriendRequest
   * @name FriendrequestAcceptRequest
   * @request POST:/api/v1/friend-requests/{requestId}/accept
   * @secure
   */
  friendrequestAcceptRequest: (
    { requestId }: FriendrequestAcceptRequestParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags FriendRequest
   * @name FriendrequestRejectRequest
   * @request POST:/api/v1/friend-requests/{requestId}/reject
   * @secure
   */
  friendrequestRejectRequest: (
    { requestId }: FriendrequestRejectRequestParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags FriendRequest
   * @name FriendrequestSendRequest
   * @request POST:/api/v1/friend-requests/send/{receiverId}
   * @secure
   */
  friendrequestSendRequest: (
    { receiverId }: FriendrequestSendRequestParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags FriendRequest
   * @name FriendrequestCancelRequest
   * @request DELETE:/api/v1/friend-requests/cancel/{receiverId}
   * @secure
   */
  friendrequestCancelRequest: (
    { receiverId }: FriendrequestCancelRequestParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
}
