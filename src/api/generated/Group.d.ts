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
  CreateGroup,
  GroupAcceptInvitationParams,
  GroupApproveJoinRequestParams,
  GroupApprovePostParams,
  GroupBanMemberParams,
  GroupDeclineInvitationParams,
  GroupDeleteGroupParams,
  GroupDTO,
  GroupGetBannedMembersParams,
  GroupGetByIdParams,
  GroupGetGroupPostsParams,
  GroupGetMembersParams,
  GroupGetPendingJoinRequestsParams,
  GroupGetPendingPostsParams,
  GroupInviteMembersParams,
  GroupJoinGroupParams,
  GroupLeaveGroupParams,
  GroupPostDTO,
  GroupRejectJoinRequestParams,
  GroupRejectPostParams,
  GroupSearchGroupsParams,
  GroupTogglePinPostParams,
  GroupTransferOwnershipParams,
  GroupUnbanMemberParams,
  GroupUpdateMemberRoleParams,
  GroupUpdateParams,
  TungGroupMemberDTO,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export declare class Group<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;
  constructor(http: HttpClient<SecurityDataType>);
  /**
   * No description
   *
   * @tags Group
   * @name GroupApprovePost
   * @request POST:/api/v1/groups/{id}/posts/{postId}/approve
   * @secure
   */
  groupApprovePost: (
    { id, postId }: GroupApprovePostParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetPendingPosts
   * @request GET:/api/v1/groups/{id}/posts/pending
   * @secure
   */
  groupGetPendingPosts: (
    { id }: GroupGetPendingPostsParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<GroupPostDTO>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupSearchGroups
   * @request GET:/api/v1/groups/search
   * @secure
   */
  groupSearchGroups: (
    query: GroupSearchGroupsParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<GroupDTO>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetById
   * @request GET:/api/v1/groups/{id}
   * @secure
   */
  groupGetById: (
    { id }: GroupGetByIdParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<GroupDTO>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupUpdate
   * @request PUT:/api/v1/groups/{id}
   * @secure
   */
  groupUpdate: (
    { id }: GroupUpdateParams,
    data: CreateGroup,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupDeleteGroup
   * @request DELETE:/api/v1/groups/{id}
   * @secure
   */
  groupDeleteGroup: (
    { id }: GroupDeleteGroupParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupInviteMembers
   * @request POST:/api/v1/groups/{id}/invite
   * @secure
   */
  groupInviteMembers: (
    { id }: GroupInviteMembersParams,
    data: any,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupAcceptInvitation
   * @request POST:/api/v1/groups/{id}/accept
   * @secure
   */
  groupAcceptInvitation: (
    { id }: GroupAcceptInvitationParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupDeclineInvitation
   * @request POST:/api/v1/groups/{id}/decline
   * @secure
   */
  groupDeclineInvitation: (
    { id }: GroupDeclineInvitationParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupApproveJoinRequest
   * @request POST:/api/v1/groups/{id}/approve/{userId}
   * @secure
   */
  groupApproveJoinRequest: (
    { id, userId }: GroupApproveJoinRequestParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupRejectJoinRequest
   * @request POST:/api/v1/groups/{id}/reject/{userId}
   * @secure
   */
  groupRejectJoinRequest: (
    { id, userId }: GroupRejectJoinRequestParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetPendingJoinRequests
   * @request GET:/api/v1/groups/{id}/requests
   * @secure
   */
  groupGetPendingJoinRequests: (
    { id }: GroupGetPendingJoinRequestsParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<TungGroupMemberDTO>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupTransferOwnership
   * @request POST:/api/v1/groups/{id}/transfer-ownership
   * @secure
   */
  groupTransferOwnership: (
    { id }: GroupTransferOwnershipParams,
    data: any,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupUpdateMemberRole
   * @request POST:/api/v1/groups/{id}/members/{userId}/role
   * @secure
   */
  groupUpdateMemberRole: (
    { id, userId }: GroupUpdateMemberRoleParams,
    data: any,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetBannedMembers
   * @request GET:/api/v1/groups/{id}/members/banned
   * @secure
   */
  groupGetBannedMembers: (
    { id }: GroupGetBannedMembersParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<TungGroupMemberDTO>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupUnbanMember
   * @request POST:/api/v1/groups/{id}/members/{userId}/unban
   * @secure
   */
  groupUnbanMember: (
    { id, userId }: GroupUnbanMemberParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupTogglePinPost
   * @request POST:/api/v1/groups/{id}/posts/{postId}/pin
   * @secure
   */
  groupTogglePinPost: (
    { id, postId }: GroupTogglePinPostParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetGroupPosts
   * @request GET:/api/v1/groups/{id}/posts
   * @secure
   */
  groupGetGroupPosts: (
    { id }: GroupGetGroupPostsParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<GroupPostDTO>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetMyGroups
   * @request GET:/api/v1/groups/my-groups
   * @secure
   */
  groupGetMyGroups: (
    params?: RequestParams,
  ) => Promise<AxiosResponse<GroupDTO>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetMyManagedGroups
   * @request GET:/api/v1/groups/my-managed
   * @secure
   */
  groupGetMyManagedGroups: (
    params?: RequestParams,
  ) => Promise<AxiosResponse<GroupDTO>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetMyJoinedGroups
   * @request GET:/api/v1/groups/my-joined
   * @secure
   */
  groupGetMyJoinedGroups: (
    params?: RequestParams,
  ) => Promise<AxiosResponse<GroupDTO>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetDiscoverGroups
   * @request GET:/api/v1/groups/discover
   * @secure
   */
  groupGetDiscoverGroups: (
    params?: RequestParams,
  ) => Promise<AxiosResponse<GroupDTO>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetPendingInvitations
   * @request GET:/api/v1/groups/invitations
   * @secure
   */
  groupGetPendingInvitations: (
    params?: RequestParams,
  ) => Promise<AxiosResponse<GroupDTO>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupRejectPost
   * @request POST:/api/v1/groups/{id}/posts/{postId}/reject
   * @secure
   */
  groupRejectPost: (
    { id, postId }: GroupRejectPostParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupLeaveGroup
   * @request DELETE:/api/v1/groups/{id}/leave
   * @secure
   */
  groupLeaveGroup: (
    { id }: GroupLeaveGroupParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupJoinGroup
   * @request POST:/api/v1/groups/{id}/join
   * @secure
   */
  groupJoinGroup: (
    { id }: GroupJoinGroupParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupBanMember
   * @request POST:/api/v1/groups/{id}/ban/{userId}
   * @secure
   */
  groupBanMember: (
    { id, userId }: GroupBanMemberParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetMembers
   * @request GET:/api/v1/groups/{id}/members
   * @secure
   */
  groupGetMembers: (
    { id }: GroupGetMembersParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<TungGroupMemberDTO>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupGetAll
   * @request GET:/api/v1/groups
   * @secure
   */
  groupGetAll: (params?: RequestParams) => Promise<AxiosResponse<GroupDTO>>;
  /**
   * No description
   *
   * @tags Group
   * @name GroupCreate
   * @request POST:/api/v1/groups
   * @secure
   */
  groupCreate: (
    data: CreateGroup,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
}
