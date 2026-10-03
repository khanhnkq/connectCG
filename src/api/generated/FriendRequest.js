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

export class FriendRequest {
  http;
  constructor(http) {
    this.http = http;
  }
  /**
   * No description
   *
   * @tags FriendRequest
   * @name FriendrequestGetPendingRequests
   * @request GET:/api/v1/friend-requests
   * @secure
   */
  friendrequestGetPendingRequests = (query, params = {}) =>
    this.http.request({
      path: `/api/v1/friend-requests`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags FriendRequest
   * @name FriendrequestAcceptRequest
   * @request POST:/api/v1/friend-requests/{requestId}/accept
   * @secure
   */
  friendrequestAcceptRequest = ({ requestId }, params = {}) =>
    this.http.request({
      path: `/api/v1/friend-requests/${requestId}/accept`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags FriendRequest
   * @name FriendrequestRejectRequest
   * @request POST:/api/v1/friend-requests/{requestId}/reject
   * @secure
   */
  friendrequestRejectRequest = ({ requestId }, params = {}) =>
    this.http.request({
      path: `/api/v1/friend-requests/${requestId}/reject`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags FriendRequest
   * @name FriendrequestSendRequest
   * @request POST:/api/v1/friend-requests/send/{receiverId}
   * @secure
   */
  friendrequestSendRequest = ({ receiverId }, params = {}) =>
    this.http.request({
      path: `/api/v1/friend-requests/send/${receiverId}`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags FriendRequest
   * @name FriendrequestCancelRequest
   * @request DELETE:/api/v1/friend-requests/cancel/{receiverId}
   * @secure
   */
  friendrequestCancelRequest = ({ receiverId }, params = {}) =>
    this.http.request({
      path: `/api/v1/friend-requests/cancel/${receiverId}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
}
