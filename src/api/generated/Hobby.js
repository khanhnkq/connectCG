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

export class Hobby {
  http;
  constructor(http) {
    this.http = http;
  }
  /**
   * No description
   *
   * @tags Hobby
   * @name HobbyGetAllHobbies
   * @request GET:/api/v1/hobbies
   * @secure
   */
  hobbyGetAllHobbies = (params = {}) =>
    this.http.request({
      path: `/api/v1/hobbies`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
