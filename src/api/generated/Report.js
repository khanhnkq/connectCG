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
export class Report {
  http;
  constructor(http) {
    this.http = http;
  }
  /**
   * No description
   *
   * @tags Report
   * @name ReportGetReports
   * @request GET:/api/v1/reports
   * @secure
   */
  reportGetReports = (query, params = {}) =>
    this.http.request({
      path: `/api/v1/reports`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Report
   * @name ReportCreateReport
   * @request POST:/api/v1/reports
   * @secure
   */
  reportCreateReport = (data, params = {}) =>
    this.http.request({
      path: `/api/v1/reports`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Report
   * @name ReportGetReportDetail
   * @request GET:/api/v1/reports/{id}
   * @secure
   */
  reportGetReportDetail = ({ id }, params = {}) =>
    this.http.request({
      path: `/api/v1/reports/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Report
   * @name ReportUpdateReportStatus
   * @request PUT:/api/v1/reports/{id}
   * @secure
   */
  reportUpdateReportStatus = ({ id }, data, params = {}) =>
    this.http.request({
      path: `/api/v1/reports/${id}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
