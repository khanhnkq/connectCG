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
  TungnotificationDeleteNotificationParams,
  TungNotificationDTO,
  TungnotificationGetMyNotificationsParams,
  TungnotificationMarkAsReadParams,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export declare class TungNotification<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;
  constructor(http: HttpClient<SecurityDataType>);
  /**
   * No description
   *
   * @tags TungNotification
   * @name TungnotificationGetMyNotifications
   * @request GET:/api/v1/notifications
   * @secure
   */
  tungnotificationGetMyNotifications: (
    query: TungnotificationGetMyNotificationsParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<TungNotificationDTO>>;
  /**
   * No description
   *
   * @tags TungNotification
   * @name TungnotificationMarkAllAsRead
   * @request PUT:/api/v1/notifications/read-all
   * @secure
   */
  tungnotificationMarkAllAsRead: (
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags TungNotification
   * @name TungnotificationDeleteNotification
   * @request DELETE:/api/v1/notifications/{id}
   * @secure
   */
  tungnotificationDeleteNotification: (
    { id }: TungnotificationDeleteNotificationParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags TungNotification
   * @name TungnotificationMarkAsRead
   * @request PUT:/api/v1/notifications/{id}/read
   * @secure
   */
  tungnotificationMarkAsRead: (
    { id }: TungnotificationMarkAsReadParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
}
