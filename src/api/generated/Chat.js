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
export class Chat {
  http;
  constructor(http) {
    this.http = http;
  }
  /**
   * No description
   *
   * @tags Chat
   * @name ChatRenameRoom
   * @request PUT:/api/v1/chat/{roomId}/name
   * @secure
   */
  chatRenameRoom = ({ roomId }, data, params = {}) =>
    this.http.request({
      path: `/api/v1/chat/${roomId}/name`,
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
   * @tags Chat
   * @name ChatInviteMembers
   * @request POST:/api/v1/chat/{roomId}/invite
   * @secure
   */
  chatInviteMembers = ({ roomId }, data, params = {}) =>
    this.http.request({
      path: `/api/v1/chat/${roomId}/invite`,
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
   * @tags Chat
   * @name ChatGetOrCreateDirectChat
   * @request POST:/api/v1/chat/direct/{targetUserId}
   * @secure
   */
  chatGetOrCreateDirectChat = ({ targetUserId }, params = {}) =>
    this.http.request({
      path: `/api/v1/chat/direct/${targetUserId}`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Chat
   * @name ChatCreateGroupChat
   * @request POST:/api/v1/chat/group
   * @secure
   */
  chatCreateGroupChat = (data, params = {}) =>
    this.http.request({
      path: `/api/v1/chat/group`,
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
   * @tags Chat
   * @name ChatUpdateAvatar
   * @request PUT:/api/v1/chat/{roomId}/avatar
   * @secure
   */
  chatUpdateAvatar = ({ roomId }, data, params = {}) =>
    this.http.request({
      path: `/api/v1/chat/${roomId}/avatar`,
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
   * @tags Chat
   * @name ChatRemoveMember
   * @request DELETE:/api/v1/chat/{roomId}/members/{userId}
   * @secure
   */
  chatRemoveMember = ({ roomId, userId }, params = {}) =>
    this.http.request({
      path: `/api/v1/chat/${roomId}/members/${userId}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Chat
   * @name ChatClearHistory
   * @request PUT:/api/v1/chat/{roomId}/clear
   * @secure
   */
  chatClearHistory = ({ roomId }, params = {}) =>
    this.http.request({
      path: `/api/v1/chat/${roomId}/clear`,
      method: "PUT",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Chat
   * @name ChatUpdateLastMessageAt
   * @request POST:/api/v1/chat/last-message
   * @secure
   */
  chatUpdateLastMessageAt = (data, params = {}) =>
    this.http.request({
      path: `/api/v1/chat/last-message`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Chat
   * @name ChatGetMyChatRooms
   * @request GET:/api/v1/chat/my
   * @secure
   */
  chatGetMyChatRooms = (params = {}) =>
    this.http.request({
      path: `/api/v1/chat/my`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Chat
   * @name ChatMarkAsRead
   * @request PUT:/api/v1/chat/{roomId}/read
   * @secure
   */
  chatMarkAsRead = ({ roomId }, params = {}) =>
    this.http.request({
      path: `/api/v1/chat/${roomId}/read`,
      method: "PUT",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Chat
   * @name ChatLeaveRoom
   * @request POST:/api/v1/chat/{roomId}/leave
   * @secure
   */
  chatLeaveRoom = ({ roomId }, params = {}) =>
    this.http.request({
      path: `/api/v1/chat/${roomId}/leave`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Chat
   * @name ChatDeleteRoom
   * @request DELETE:/api/v1/chat/{roomId}
   * @secure
   */
  chatDeleteRoom = ({ roomId }, params = {}) =>
    this.http.request({
      path: `/api/v1/chat/${roomId}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
}
