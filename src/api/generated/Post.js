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
export class Post {
  http;
  constructor(http) {
    this.http = http;
  }
  /**
   * No description
   *
   * @tags Post
   * @name PostGetNewsfeedPosts
   * @request GET:/api/v1/posts
   * @secure
   */
  postGetNewsfeedPosts = (query, params = {}) =>
    this.http.request({
      path: `/api/v1/posts`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Post
   * @name PostCreatePost
   * @request POST:/api/v1/posts
   * @secure
   */
  postCreatePost = (data, params = {}) =>
    this.http.request({
      path: `/api/v1/posts`,
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
   * @tags Post
   * @name PostGetPendingHomepagePosts
   * @request GET:/api/v1/posts/admin/pending
   * @secure
   */
  postGetPendingHomepagePosts = (query, params = {}) =>
    this.http.request({
      path: `/api/v1/posts/admin/pending`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Post
   * @name PostGetAuditHomepagePosts
   * @request GET:/api/v1/posts/admin/audit
   * @secure
   */
  postGetAuditHomepagePosts = (query, params = {}) =>
    this.http.request({
      path: `/api/v1/posts/admin/audit`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Post
   * @name PostApprovePost
   * @request POST:/api/v1/posts/{id}/approve
   * @secure
   */
  postApprovePost = ({ id }, params = {}) =>
    this.http.request({
      path: `/api/v1/posts/${id}/approve`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Post
   * @name PostReactToPost
   * @request POST:/api/v1/posts/{id}/react
   * @secure
   */
  postReactToPost = ({ id }, data, params = {}) =>
    this.http.request({
      path: `/api/v1/posts/${id}/react`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Post
   * @name PostUnReactToPost
   * @request DELETE:/api/v1/posts/{id}/react
   * @secure
   */
  postUnReactToPost = ({ id }, params = {}) =>
    this.http.request({
      path: `/api/v1/posts/${id}/react`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Post
   * @name PostGetPostById
   * @request GET:/api/v1/posts/{id}
   * @secure
   */
  postGetPostById = ({ id }, params = {}) =>
    this.http.request({
      path: `/api/v1/posts/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Post
   * @name PostUpdatePost
   * @request PUT:/api/v1/posts/{id}
   * @secure
   */
  postUpdatePost = ({ id }, data, params = {}) =>
    this.http.request({
      path: `/api/v1/posts/${id}`,
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
   * @tags Post
   * @name PostDeletePost
   * @request DELETE:/api/v1/posts/{id}
   * @secure
   */
  postDeletePost = ({ id }, params = {}) =>
    this.http.request({
      path: `/api/v1/posts/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Post
   * @name PostGetUserProfilePosts
   * @request GET:/api/v1/posts/user/{id}
   * @secure
   */
  postGetUserProfilePosts = ({ id }, params = {}) =>
    this.http.request({
      path: `/api/v1/posts/user/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Post
   * @name PostGetPublicHomepagePosts
   * @request GET:/api/v1/posts/public/homepage
   * @secure
   */
  postGetPublicHomepagePosts = (query, params = {}) =>
    this.http.request({
      path: `/api/v1/posts/public/homepage`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Post
   * @name PostRejectPost
   * @request POST:/api/v1/posts/{id}/reject
   * @secure
   */
  postRejectPost = ({ id }, params = {}) =>
    this.http.request({
      path: `/api/v1/posts/${id}/reject`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Post
   * @name PostSharePost
   * @request POST:/api/v1/posts/{id}/share
   * @secure
   */
  postSharePost = ({ id }, data, params = {}) =>
    this.http.request({
      path: `/api/v1/posts/${id}/share`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
