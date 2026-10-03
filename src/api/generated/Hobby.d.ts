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

import { HobbyDTO } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export declare class Hobby<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;
  constructor(http: HttpClient<SecurityDataType>);
  /**
   * No description
   *
   * @tags Hobby
   * @name HobbyGetAllHobbies
   * @request GET:/api/v1/hobbies
   * @secure
   */
  hobbyGetAllHobbies: (
    params?: RequestParams,
  ) => Promise<AxiosResponse<HobbyDTO>>;
}
