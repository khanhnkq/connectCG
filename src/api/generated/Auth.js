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
export class Auth {
  http;
  constructor(http) {
    this.http = http;
  }
  /**
   * No description
   *
   * @tags Auth
   * @name AuthRefresh
   * @request POST:/api/v1/auth/refresh
   * @secure
   */
  authRefresh = (params = {}) =>
    this.http.request({
      path: `/api/v1/auth/refresh`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name AuthCreateProfile
   * @request POST:/api/v1/auth/profile
   * @secure
   */
  authCreateProfile = (data, params = {}) =>
    this.http.request({
      path: `/api/v1/auth/profile`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name AuthForgotPassword
   * @request POST:/api/v1/auth/forgot-password
   * @secure
   */
  authForgotPassword = (query, params = {}) =>
    this.http.request({
      path: `/api/v1/auth/forgot-password`,
      method: "POST",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name AuthResetPassword
   * @request POST:/api/v1/auth/reset-password
   * @secure
   */
  authResetPassword = (query, params = {}) =>
    this.http.request({
      path: `/api/v1/auth/reset-password`,
      method: "POST",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name AuthVerifyEmail
   * @request GET:/api/v1/auth/verify-email
   * @secure
   */
  authVerifyEmail = (query, params = {}) =>
    this.http.request({
      path: `/api/v1/auth/verify-email`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name AuthAuthenticateUser
   * @request POST:/api/v1/auth/login
   * @secure
   */
  authAuthenticateUser = (data, params = {}) =>
    this.http.request({
      path: `/api/v1/auth/login`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name AuthCurrentSession
   * @request GET:/api/v1/auth/me
   * @secure
   */
  authCurrentSession = (params = {}) =>
    this.http.request({
      path: `/api/v1/auth/me`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name AuthRegisterUser
   * @request POST:/api/v1/auth/register
   * @secure
   */
  authRegisterUser = (data, params = {}) =>
    this.http.request({
      path: `/api/v1/auth/register`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name AuthCsrf
   * @request GET:/api/v1/auth/csrf
   * @secure
   */
  authCsrf = (params = {}) =>
    this.http.request({
      path: `/api/v1/auth/csrf`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name AuthLogout
   * @request POST:/api/v1/auth/logout
   * @secure
   */
  authLogout = (params = {}) =>
    this.http.request({
      path: `/api/v1/auth/logout`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name AuthLogoutAll
   * @request POST:/api/v1/auth/logout-all
   * @secure
   */
  authLogoutAll = (params = {}) =>
    this.http.request({
      path: `/api/v1/auth/logout-all`,
      method: "POST",
      secure: true,
      ...params,
    });
}
