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
  ChatClearHistoryParams,
  ChatDeleteRoomParams,
  ChatGetOrCreateDirectChatParams,
  ChatInviteMembersParams,
  ChatLeaveRoomParams,
  ChatMarkAsReadParams,
  ChatRemoveMemberParams,
  ChatRenameRoomParams,
  ChatRoomDTO,
  ChatUpdateAvatarParams,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export declare class Chat<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;
  constructor(http: HttpClient<SecurityDataType>);
  /**
   * No description
   *
   * @tags Chat
   * @name ChatRenameRoom
   * @request PUT:/api/v1/chat/{roomId}/name
   * @secure
   */
  chatRenameRoom: (
    { roomId }: ChatRenameRoomParams,
    data: any,
    params?: RequestParams,
  ) => Promise<AxiosResponse<ChatRoomDTO>>;
  /**
   * No description
   *
   * @tags Chat
   * @name ChatInviteMembers
   * @request POST:/api/v1/chat/{roomId}/invite
   * @secure
   */
  chatInviteMembers: (
    { roomId }: ChatInviteMembersParams,
    data: any,
    params?: RequestParams,
  ) => Promise<AxiosResponse<ChatRoomDTO>>;
  /**
   * No description
   *
   * @tags Chat
   * @name ChatGetOrCreateDirectChat
   * @request POST:/api/v1/chat/direct/{targetUserId}
   * @secure
   */
  chatGetOrCreateDirectChat: (
    { targetUserId }: ChatGetOrCreateDirectChatParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<ChatRoomDTO>>;
  /**
   * No description
   *
   * @tags Chat
   * @name ChatCreateGroupChat
   * @request POST:/api/v1/chat/group
   * @secure
   */
  chatCreateGroupChat: (
    data: any,
    params?: RequestParams,
  ) => Promise<AxiosResponse<ChatRoomDTO>>;
  /**
   * No description
   *
   * @tags Chat
   * @name ChatUpdateAvatar
   * @request PUT:/api/v1/chat/{roomId}/avatar
   * @secure
   */
  chatUpdateAvatar: (
    { roomId }: ChatUpdateAvatarParams,
    data: any,
    params?: RequestParams,
  ) => Promise<AxiosResponse<ChatRoomDTO>>;
  /**
   * No description
   *
   * @tags Chat
   * @name ChatRemoveMember
   * @request DELETE:/api/v1/chat/{roomId}/members/{userId}
   * @secure
   */
  chatRemoveMember: (
    { roomId, userId }: ChatRemoveMemberParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<ChatRoomDTO>>;
  /**
   * No description
   *
   * @tags Chat
   * @name ChatClearHistory
   * @request PUT:/api/v1/chat/{roomId}/clear
   * @secure
   */
  chatClearHistory: (
    { roomId }: ChatClearHistoryParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Chat
   * @name ChatUpdateLastMessageAt
   * @request POST:/api/v1/chat/last-message
   * @secure
   */
  chatUpdateLastMessageAt: (
    data: any,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Chat
   * @name ChatGetMyChatRooms
   * @request GET:/api/v1/chat/my
   * @secure
   */
  chatGetMyChatRooms: (
    params?: RequestParams,
  ) => Promise<AxiosResponse<ChatRoomDTO>>;
  /**
   * No description
   *
   * @tags Chat
   * @name ChatMarkAsRead
   * @request PUT:/api/v1/chat/{roomId}/read
   * @secure
   */
  chatMarkAsRead: (
    { roomId }: ChatMarkAsReadParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Chat
   * @name ChatLeaveRoom
   * @request POST:/api/v1/chat/{roomId}/leave
   * @secure
   */
  chatLeaveRoom: (
    { roomId }: ChatLeaveRoomParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Chat
   * @name ChatDeleteRoom
   * @request DELETE:/api/v1/chat/{roomId}
   * @secure
   */
  chatDeleteRoom: (
    { roomId }: ChatDeleteRoomParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
}
