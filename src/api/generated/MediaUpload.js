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

export class MediaUpload {
  http;
  constructor(http) {
    this.http = http;
  }
  /**
   * No description
   *
   * @tags MediaUpload
   * @name MediauploadUpload
   * @request POST:/api/v1/media/upload
   * @secure
   */
  mediauploadUpload = (query, params = {}) =>
    this.http.request({
      path: `/api/v1/media/upload`,
      method: "POST",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags MediaUpload
   * @name MediauploadViewMedia
   * @request GET:/api/v1/media/view/**
   * @secure
   */
  mediauploadViewMedia = (params = {}) =>
    this.http.request({
      path: `/api/v1/media/view/**`,
      method: "GET",
      secure: true,
      ...params,
    });
}
