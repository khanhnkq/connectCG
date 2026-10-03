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
  FriendsuggestionDismissSuggestionParams,
  FriendsuggestionGetSuggestionsParams,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export declare class FriendSuggestion<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;
  constructor(http: HttpClient<SecurityDataType>);
  /**
   * No description
   *
   * @tags FriendSuggestion
   * @name FriendsuggestionGetSuggestions
   * @request GET:/api/v1/friends/suggestions
   * @secure
   */
  friendsuggestionGetSuggestions: (
    query: FriendsuggestionGetSuggestionsParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags FriendSuggestion
   * @name FriendsuggestionDismissSuggestion
   * @request DELETE:/api/v1/friends/suggestions/{dismissedUserId}
   * @secure
   */
  friendsuggestionDismissSuggestion: (
    { dismissedUserId }: FriendsuggestionDismissSuggestionParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags FriendSuggestion
   * @name FriendsuggestionRefreshSuggestions
   * @request POST:/api/v1/friends/suggestions/refresh
   * @secure
   */
  friendsuggestionRefreshSuggestions: (
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
}
