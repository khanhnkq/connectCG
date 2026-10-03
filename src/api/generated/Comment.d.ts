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
  CommentCreateCommentParams,
  CommentDeleteCommentParams,
  CommentDTO,
  CommentGetCommentsParams,
  CreateCommentRequest,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export declare class Comment<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;
  constructor(http: HttpClient<SecurityDataType>);
  /**
   * No description
   *
   * @tags Comment
   * @name CommentGetComments
   * @request GET:/api/v1/posts/{postId}/comments
   * @secure
   */
  commentGetComments: (
    { postId }: CommentGetCommentsParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<CommentDTO>>;
  /**
   * No description
   *
   * @tags Comment
   * @name CommentCreateComment
   * @request POST:/api/v1/posts/{postId}/comments
   * @secure
   */
  commentCreateComment: (
    { postId }: CommentCreateCommentParams,
    data: CreateCommentRequest,
    params?: RequestParams,
  ) => Promise<AxiosResponse<CommentDTO>>;
  /**
   * No description
   *
   * @tags Comment
   * @name CommentDeleteComment
   * @request DELETE:/api/v1/posts/{postId}/comments/{commentId}
   * @secure
   */
  commentDeleteComment: (
    { postId, commentId }: CommentDeleteCommentParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
}
