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
  ReportAdminUpdateRequest,
  ReportGetReportDetailParams,
  ReportGetReportsParams,
  ReportRequest,
  ReportResponse,
  ReportUpdateReportStatusParams,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export declare class Report<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;
  constructor(http: HttpClient<SecurityDataType>);
  /**
   * No description
   *
   * @tags Report
   * @name ReportGetReports
   * @request GET:/api/v1/reports
   * @secure
   */
  reportGetReports: (
    query: ReportGetReportsParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Report
   * @name ReportCreateReport
   * @request POST:/api/v1/reports
   * @secure
   */
  reportCreateReport: (
    data: ReportRequest,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Report
   * @name ReportGetReportDetail
   * @request GET:/api/v1/reports/{id}
   * @secure
   */
  reportGetReportDetail: (
    { id }: ReportGetReportDetailParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<ReportResponse>>;
  /**
   * No description
   *
   * @tags Report
   * @name ReportUpdateReportStatus
   * @request PUT:/api/v1/reports/{id}
   * @secure
   */
  reportUpdateReportStatus: (
    { id }: ReportUpdateReportStatusParams,
    data: ReportAdminUpdateRequest,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
}
