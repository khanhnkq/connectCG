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

import { HttpClient, RequestParams } from "./http-client";
export declare class HealthCheck<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;
  constructor(http: HttpClient<SecurityDataType>);
  /**
   * No description
   *
   * @tags HealthCheck
   * @name HealthcheckCheckReadiness
   * @request GET:/api/v1/health/readiness
   * @secure
   */
  healthcheckCheckReadiness: (
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
}
