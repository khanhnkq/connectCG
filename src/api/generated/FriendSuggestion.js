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

export class FriendSuggestion {
  http;
  constructor(http) {
    this.http = http;
  }
  /**
   * No description
   *
   * @tags FriendSuggestion
   * @name FriendsuggestionGetSuggestions
   * @request GET:/api/v1/friends/suggestions
   * @secure
   */
  friendsuggestionGetSuggestions = (query, params = {}) =>
    this.http.request({
      path: `/api/v1/friends/suggestions`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags FriendSuggestion
   * @name FriendsuggestionDismissSuggestion
   * @request DELETE:/api/v1/friends/suggestions/{dismissedUserId}
   * @secure
   */
  friendsuggestionDismissSuggestion = ({ dismissedUserId }, params = {}) =>
    this.http.request({
      path: `/api/v1/friends/suggestions/${dismissedUserId}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags FriendSuggestion
   * @name FriendsuggestionRefreshSuggestions
   * @request POST:/api/v1/friends/suggestions/refresh
   * @secure
   */
  friendsuggestionRefreshSuggestions = (params = {}) =>
    this.http.request({
      path: `/api/v1/friends/suggestions/refresh`,
      method: "POST",
      secure: true,
      ...params,
    });
}
