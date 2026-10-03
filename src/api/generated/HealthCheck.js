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

export class HealthCheck {
  http;
  constructor(http) {
    this.http = http;
  }
  /**
   * No description
   *
   * @tags HealthCheck
   * @name HealthcheckCheckReadiness
   * @request GET:/api/v1/health/readiness
   * @secure
   */
  healthcheckCheckReadiness = (params = {}) =>
    this.http.request({
      path: `/api/v1/health/readiness`,
      method: "GET",
      secure: true,
      ...params,
    });
}
