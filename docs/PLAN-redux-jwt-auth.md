# Plan: Redux Toolkit + JWT Authentication

This plan outlines the steps to integrate Redux Toolkit (RTK) for managing JWT authentication state, reusing the existing `authService` and `axiosConfig`.

## 1. Preparation & Installation

- [x] **Install Dependencies**
  - `@reduxjs/toolkit`, `react-redux`, `jwt-decode`.
  - Command: `npm install @reduxjs/toolkit react-redux jwt-decode`

## 2. Architecture & Folder Structure

Reuse existing `services` and `config`. Create `src/redux` directory.

```text
src/
  redux/
    store.js           # Main store configuration
    slices/
      authSlice.js     # Auth state, uses authService
  services/
    authService.js     # Existing service (no changes needed or minor tweaks)
  config/
    axiosConfig.js     # Existing config (verified interceptors)
```

## 3. Implementation Steps

### Phase 1: Store Setup

- [ ] **Create `authSlice.js`**
  - State: `{ user: null, token: null, isAuthenticated: false, loading: false, error: null }`
  - Thunks: `loginUser`
    - Call `authService.login(username, password)`.
    - Return payload for reducer.
  - Reducers: `setCredentials`, `logout`.
  - Persistence: Initialize state from `localStorage` (via `authService.getCurrentUser` or direct read).
- [ ] **Configure `store.js`**
  - Configure the store with `authReducer`.
- [ ] **Provide Store**
  - Wrap `App` in `main.jsx`.

### Phase 2: UI Integration

- [ ] **Update Login Page (`src/pages/auth/Login.jsx`)**

  - Replace direct `authService.login` call with `dispatch(loginUser(values))`.
  - Use `useSelector` to handle loading/error states.
  - Redirect logic remains (or moves to `useEffect` depending on preference, but keeping it in `handleSubmit` via `unwrap()` is often easier).

- [ ] **Update Protected Routes (Future Step)**
  - Use `useSelector` to check `isAuthenticated`.

## 4. Verification Plan

### Manual Verification

1. **Login Flow**:
   - Enter credentials -> Click Login.
   - Verify Redux DevTools: State updates to `isAuthenticated: true`.
   - Verify `localStorage`: Token is present.
   - Verify Redirect: User moves to Dashboard.
2. **Reload**:
   - Refresh page.
   - Verify Redux state rehydrates from `localStorage`.
3. **Logout**:
   - Dispatch logout action (or click logout button if implemented).
   - Verify State clears & localStorage clears.
