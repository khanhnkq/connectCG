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
export class Group {
  http;
  constructor(http) {
    this.http = http;
  }
  /**
   * No description
   *
   * @tags Group
   * @name GroupApprovePost
   * @request POST:/api/v1/groups/{id}/posts/{postId}/approve
   * @secure
   */
  groupApprovePost = ({ id, postId }, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}/posts/${postId}/approve`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetPendingPosts
   * @request GET:/api/v1/groups/{id}/posts/pending
   * @secure
   */
  groupGetPendingPosts = ({ id }, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}/posts/pending`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupSearchGroups
   * @request GET:/api/v1/groups/search
   * @secure
   */
  groupSearchGroups = (query, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/search`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetById
   * @request GET:/api/v1/groups/{id}
   * @secure
   */
  groupGetById = ({ id }, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupUpdate
   * @request PUT:/api/v1/groups/{id}
   * @secure
   */
  groupUpdate = ({ id }, data, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupDeleteGroup
   * @request DELETE:/api/v1/groups/{id}
   * @secure
   */
  groupDeleteGroup = ({ id }, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupInviteMembers
   * @request POST:/api/v1/groups/{id}/invite
   * @secure
   */
  groupInviteMembers = ({ id }, data, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}/invite`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupAcceptInvitation
   * @request POST:/api/v1/groups/{id}/accept
   * @secure
   */
  groupAcceptInvitation = ({ id }, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}/accept`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupDeclineInvitation
   * @request POST:/api/v1/groups/{id}/decline
   * @secure
   */
  groupDeclineInvitation = ({ id }, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}/decline`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupApproveJoinRequest
   * @request POST:/api/v1/groups/{id}/approve/{userId}
   * @secure
   */
  groupApproveJoinRequest = ({ id, userId }, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}/approve/${userId}`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupRejectJoinRequest
   * @request POST:/api/v1/groups/{id}/reject/{userId}
   * @secure
   */
  groupRejectJoinRequest = ({ id, userId }, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}/reject/${userId}`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetPendingJoinRequests
   * @request GET:/api/v1/groups/{id}/requests
   * @secure
   */
  groupGetPendingJoinRequests = ({ id }, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}/requests`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupTransferOwnership
   * @request POST:/api/v1/groups/{id}/transfer-ownership
   * @secure
   */
  groupTransferOwnership = ({ id }, data, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}/transfer-ownership`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupUpdateMemberRole
   * @request POST:/api/v1/groups/{id}/members/{userId}/role
   * @secure
   */
  groupUpdateMemberRole = ({ id, userId }, data, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}/members/${userId}/role`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetBannedMembers
   * @request GET:/api/v1/groups/{id}/members/banned
   * @secure
   */
  groupGetBannedMembers = ({ id }, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}/members/banned`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupUnbanMember
   * @request POST:/api/v1/groups/{id}/members/{userId}/unban
   * @secure
   */
  groupUnbanMember = ({ id, userId }, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}/members/${userId}/unban`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupTogglePinPost
   * @request POST:/api/v1/groups/{id}/posts/{postId}/pin
   * @secure
   */
  groupTogglePinPost = ({ id, postId }, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}/posts/${postId}/pin`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetGroupPosts
   * @request GET:/api/v1/groups/{id}/posts
   * @secure
   */
  groupGetGroupPosts = ({ id }, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}/posts`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetMyGroups
   * @request GET:/api/v1/groups/my-groups
   * @secure
   */
  groupGetMyGroups = (params = {}) =>
    this.http.request({
      path: `/api/v1/groups/my-groups`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetMyManagedGroups
   * @request GET:/api/v1/groups/my-managed
   * @secure
   */
  groupGetMyManagedGroups = (params = {}) =>
    this.http.request({
      path: `/api/v1/groups/my-managed`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetMyJoinedGroups
   * @request GET:/api/v1/groups/my-joined
   * @secure
   */
  groupGetMyJoinedGroups = (params = {}) =>
    this.http.request({
      path: `/api/v1/groups/my-joined`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetDiscoverGroups
   * @request GET:/api/v1/groups/discover
   * @secure
   */
  groupGetDiscoverGroups = (params = {}) =>
    this.http.request({
      path: `/api/v1/groups/discover`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetPendingInvitations
   * @request GET:/api/v1/groups/invitations
   * @secure
   */
  groupGetPendingInvitations = (params = {}) =>
    this.http.request({
      path: `/api/v1/groups/invitations`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupRejectPost
   * @request POST:/api/v1/groups/{id}/posts/{postId}/reject
   * @secure
   */
  groupRejectPost = ({ id, postId }, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}/posts/${postId}/reject`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupLeaveGroup
   * @request DELETE:/api/v1/groups/{id}/leave
   * @secure
   */
  groupLeaveGroup = ({ id }, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}/leave`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupJoinGroup
   * @request POST:/api/v1/groups/{id}/join
   * @secure
   */
  groupJoinGroup = ({ id }, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}/join`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupBanMember
   * @request POST:/api/v1/groups/{id}/ban/{userId}
   * @secure
   */
  groupBanMember = ({ id, userId }, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}/ban/${userId}`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetMembers
   * @request GET:/api/v1/groups/{id}/members
   * @secure
   */
  groupGetMembers = ({ id }, params = {}) =>
    this.http.request({
      path: `/api/v1/groups/${id}/members`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetAll
   * @request GET:/api/v1/groups
   * @secure
   */
  groupGetAll = (params = {}) =>
    this.http.request({
      path: `/api/v1/groups`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Group
   * @name GroupCreate
   * @request POST:/api/v1/groups
   * @secure
   */
  groupCreate = (data, params = {}) =>
    this.http.request({
      path: `/api/v1/groups`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
