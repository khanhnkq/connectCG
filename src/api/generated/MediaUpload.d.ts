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

import { MediaUploadResponse, MediauploadUploadParams } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export declare class MediaUpload<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;
  constructor(http: HttpClient<SecurityDataType>);
  /**
   * No description
   *
   * @tags MediaUpload
   * @name MediauploadUpload
   * @request POST:/api/v1/media/upload
   * @secure
   */
  mediauploadUpload: (
    query: MediauploadUploadParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<MediaUploadResponse>>;
  /**
   * No description
   *
   * @tags MediaUpload
   * @name MediauploadViewMedia
   * @request GET:/api/v1/media/view/**
   * @secure
   */
  mediauploadViewMedia: (
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
}
