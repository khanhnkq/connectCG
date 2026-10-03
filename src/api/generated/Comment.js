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
export class Comment {
  http;
  constructor(http) {
    this.http = http;
  }
  /**
   * No description
   *
   * @tags Comment
   * @name CommentGetComments
   * @request GET:/api/v1/posts/{postId}/comments
   * @secure
   */
  commentGetComments = ({ postId }, params = {}) =>
    this.http.request({
      path: `/api/v1/posts/${postId}/comments`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Comment
   * @name CommentCreateComment
   * @request POST:/api/v1/posts/{postId}/comments
   * @secure
   */
  commentCreateComment = ({ postId }, data, params = {}) =>
    this.http.request({
      path: `/api/v1/posts/${postId}/comments`,
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
   * @tags Comment
   * @name CommentDeleteComment
   * @request DELETE:/api/v1/posts/{postId}/comments/{commentId}
   * @secure
   */
  commentDeleteComment = ({ postId, commentId }, params = {}) =>
    this.http.request({
      path: `/api/v1/posts/${postId}/comments/${commentId}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
}
