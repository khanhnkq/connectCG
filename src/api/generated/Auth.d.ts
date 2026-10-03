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
  AuthForgotPasswordParams,
  AuthResetPasswordParams,
  AuthSessionResponse,
  AuthVerifyEmailParams,
  CreatProfileRequest,
  LoginRequest,
  RegisterRequest,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export declare class Auth<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;
  constructor(http: HttpClient<SecurityDataType>);
  /**
   * No description
   *
   * @tags Auth
   * @name AuthRefresh
   * @request POST:/api/v1/auth/refresh
   * @secure
   */
  authRefresh: (params?: RequestParams) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Auth
   * @name AuthCreateProfile
   * @request POST:/api/v1/auth/profile
   * @secure
   */
  authCreateProfile: (
    data: CreatProfileRequest,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Auth
   * @name AuthForgotPassword
   * @request POST:/api/v1/auth/forgot-password
   * @secure
   */
  authForgotPassword: (
    query: AuthForgotPasswordParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Auth
   * @name AuthResetPassword
   * @request POST:/api/v1/auth/reset-password
   * @secure
   */
  authResetPassword: (
    query: AuthResetPasswordParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Auth
   * @name AuthVerifyEmail
   * @request GET:/api/v1/auth/verify-email
   * @secure
   */
  authVerifyEmail: (
    query: AuthVerifyEmailParams,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Auth
   * @name AuthAuthenticateUser
   * @request POST:/api/v1/auth/login
   * @secure
   */
  authAuthenticateUser: (
    data: LoginRequest,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Auth
   * @name AuthCurrentSession
   * @request GET:/api/v1/auth/me
   * @secure
   */
  authCurrentSession: (
    params?: RequestParams,
  ) => Promise<AxiosResponse<AuthSessionResponse>>;
  /**
   * No description
   *
   * @tags Auth
   * @name AuthRegisterUser
   * @request POST:/api/v1/auth/register
   * @secure
   */
  authRegisterUser: (
    data: RegisterRequest,
    params?: RequestParams,
  ) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Auth
   * @name AuthCsrf
   * @request GET:/api/v1/auth/csrf
   * @secure
   */
  authCsrf: (params?: RequestParams) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Auth
   * @name AuthLogout
   * @request POST:/api/v1/auth/logout
   * @secure
   */
  authLogout: (params?: RequestParams) => Promise<AxiosResponse<void>>;
  /**
   * No description
   *
   * @tags Auth
   * @name AuthLogoutAll
   * @request POST:/api/v1/auth/logout-all
   * @secure
   */
  authLogoutAll: (params?: RequestParams) => Promise<AxiosResponse<void>>;
}
