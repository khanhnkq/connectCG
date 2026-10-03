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

export class TungNotification {
  http;
  constructor(http) {
    this.http = http;
  }
  /**
   * No description
   *
   * @tags TungNotification
   * @name TungnotificationGetMyNotifications
   * @request GET:/api/v1/notifications
   * @secure
   */
  tungnotificationGetMyNotifications = (query, params = {}) =>
    this.http.request({
      path: `/api/v1/notifications`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags TungNotification
   * @name TungnotificationMarkAllAsRead
   * @request PUT:/api/v1/notifications/read-all
   * @secure
   */
  tungnotificationMarkAllAsRead = (params = {}) =>
    this.http.request({
      path: `/api/v1/notifications/read-all`,
      method: "PUT",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags TungNotification
   * @name TungnotificationDeleteNotification
   * @request DELETE:/api/v1/notifications/{id}
   * @secure
   */
  tungnotificationDeleteNotification = ({ id }, params = {}) =>
    this.http.request({
      path: `/api/v1/notifications/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags TungNotification
   * @name TungnotificationMarkAsRead
   * @request PUT:/api/v1/notifications/{id}/read
   * @secure
   */
  tungnotificationMarkAsRead = ({ id }, params = {}) =>
    this.http.request({
      path: `/api/v1/notifications/${id}/read`,
      method: "PUT",
      secure: true,
      ...params,
    });
}
