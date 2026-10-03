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
  CreatePostRequest,
  GroupPostDTO,
  PostApprovePostParams,
  PostDeletePostParams,
  PostGetAuditHomepagePostsParams,
  PostGetNewsfeedPostsParams,
  PostGetPendingHomepagePostsParams,
  PostGetPostByIdParams,
  PostGetPublicHomepagePostsParams,
  PostGetUserProfilePostsParams,
  PostReactToPostParams,
  PostRejectPostParams,
  PostSharePostParams,
  PostUnReactToPostParams,
  PostUpdatePostParams,
  ReactionRequest,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export declare class Post<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;
  constructor(http: HttpClient<SecurityDataType>);
  /**
   * No description
   *
   * @tags Post
   * @name PostGetNewsfeedPosts
   * @request GET:/api/v1/posts
   * @secure
   */
  postGetNewsfeedPosts: (
    query: PostGetNewsfeedPostsParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Post
   * @name PostCreatePost
   * @request POST:/api/v1/posts
   * @secure
   */
  postCreatePost: (
    data: CreatePostRequest,
    params?: RequestParams,
  ) => Promise<AxiosResponse<GroupPostDTO>>;
  /**
   * No description
   *
   * @tags Post
   * @name PostGetPendingHomepagePosts
   * @request GET:/api/v1/posts/admin/pending
   * @secure
   */
  postGetPendingHomepagePosts: (
    query: PostGetPendingHomepagePostsParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<GroupPostDTO>>;
  /**
   * No description
   *
   * @tags Post
   * @name PostGetAuditHomepagePosts
   * @request GET:/api/v1/posts/admin/audit
   * @secure
   */
  postGetAuditHomepagePosts: (
    query: PostGetAuditHomepagePostsParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<GroupPostDTO>>;
  /**
   * No description
   *
   * @tags Post
   * @name PostApprovePost
   * @request POST:/api/v1/posts/{id}/approve
   * @secure
   */
  postApprovePost: (
    { id }: PostApprovePostParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Post
   * @name PostReactToPost
   * @request POST:/api/v1/posts/{id}/react
   * @secure
   */
  postReactToPost: (
    { id }: PostReactToPostParams,
    data: ReactionRequest,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Post
   * @name PostUnReactToPost
   * @request DELETE:/api/v1/posts/{id}/react
   * @secure
   */
  postUnReactToPost: (
    { id }: PostUnReactToPostParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Post
   * @name PostGetPostById
   * @request GET:/api/v1/posts/{id}
   * @secure
   */
  postGetPostById: (
    { id }: PostGetPostByIdParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<GroupPostDTO>>;
  /**
   * No description
   *
   * @tags Post
   * @name PostUpdatePost
   * @request PUT:/api/v1/posts/{id}
   * @secure
   */
  postUpdatePost: (
    { id }: PostUpdatePostParams,
    data: CreatePostRequest,
    params?: RequestParams,
  ) => Promise<AxiosResponse<GroupPostDTO>>;
  /**
   * No description
   *
   * @tags Post
   * @name PostDeletePost
   * @request DELETE:/api/v1/posts/{id}
   * @secure
   */
  postDeletePost: (
    { id }: PostDeletePostParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Post
   * @name PostGetUserProfilePosts
   * @request GET:/api/v1/posts/user/{id}
   * @secure
   */
  postGetUserProfilePosts: (
    { id }: PostGetUserProfilePostsParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<GroupPostDTO>>;
  /**
   * No description
   *
   * @tags Post
   * @name PostGetPublicHomepagePosts
   * @request GET:/api/v1/posts/public/homepage
   * @secure
   */
  postGetPublicHomepagePosts: (
    query: PostGetPublicHomepagePostsParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Post
   * @name PostRejectPost
   * @request POST:/api/v1/posts/{id}/reject
   * @secure
   */
  postRejectPost: (
    { id }: PostRejectPostParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Post
   * @name PostSharePost
   * @request POST:/api/v1/posts/{id}/share
   * @secure
   */
  postSharePost: (
    { id }: PostSharePostParams,
    data: CreatePostRequest,
    params?: RequestParams,
  ) => Promise<AxiosResponse<GroupPostDTO>>;
}
