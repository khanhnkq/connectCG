# Plan: Email Verification for Registration

This plan outlines the steps to implement email verification. Users will need to verify their email address before logging in.

## 1. Backend Implementation (Spring Boot)

### 1.1 Database & Entity Changes

- [ ] **Modify `User` Entity**: Add `isEnabled` (Boolean) field to track verification status. Default to `false`.
- [ ] **Create `VerificationToken` Entity**: Check `PasswordResetToken` for reference. It links a `token` (String) to a `User` with an expiry date.
- [ ] **Create `VerificationTokenRepository`**: Interface for database operations.

### 1.2 Service Layer Updates (`AuthService`)

- [ ] **Update `register` method**:
  - Set `isEnabled = false` for new users.
  - Generate a random token (UUID).
  - Save the token to `VerificationTokenRepository`.
  - Send an email (using `EmailService`) containing the verification link: `http://localhost:5173/verify-email?token=...`.
- [ ] **Add `verifyEmail(String token)` method**:
  - Find token.
  - Check expiry.
  - Set `user.isEnabled = true`.
  - Delete or invalidate token.

### 1.3 Controller Layer Updates (`AuthController`)

- [ ] **Add Endpoint**: `GET /api/v1/auth/verify-email?token=...` calling `AuthService.verifyEmail`.

### 1.4 Security Config

- [ ] Ensure `isEnabled` is checked during authentication (Spring Security's `UserDetails` usually handles this if mapped correctly).
- [ ] Ensure `/api/v1/auth/verify-email` is public (`permitAll`).

## 2. Frontend Implementation (React)

### 2.1 Update Registration Flow

- [ ] **`Step1.jsx` (Register Page)**:
  - On success, instead of redirecting to login, show a **Success Screen**: "Registration successful! Please check your email to verify your account."

### 2.2 Create Verification Page

- [ ] **Create `VerifyEmail.jsx`**:
  - Route: `/verify-email`.
  - On mount, extract `token` from URL query params.
  - Call API: `axiosClient.get('/v1/auth/verify-email?token=' + token)`.
  - Show loading state.
  - Show Success: "Email verified! Redirecting to login..."
  - Show Error: "Invalid or expired token."

## 3. Email Template

- [ ] Design a nice HTML email template for verification (similar to the Forgot Password one).
