# Plan: Onboarding Flow Refactor

## Goal

Separate the Profile Creation (Step 2) from the Registration flow to support both Email Registration and Social Login. Users without a profile will be forced to complete the Onboarding step.

## Proposed Changes

### 1. Backend (`connectCG_BE`)

- [ ] **DTO Update (`JwtResponse`)**:
  - Add `boolean hasProfile`.
- [ ] **AuthController Update (`login` & `register`)**:
  - `login`: Check `userProfileRepository.existsByUserId(user.getId())` -> Set `hasProfile`.
  - `register`: NOW only creates `User` account. DOES NOT create `UserProfile`. Returns `hasProfile = false`.
- [ ] **Profile API**:
  - Create/Update `ProfileController` or `UserController` endpoint: `POST /api/v1/users/profile` to save profile data (from Onboarding).

### 2. Frontend (`connect.-fe`)

- [ ] **Route Structure**:
  - Rename `Step2` -> `OnboardingPage`.
  - Route `/onboarding` (Protected Route).
- [ ] **Auth Logic (`Login.jsx`)**:
  - Receive `hasProfile` from login.
  - If `false` -> `navigate('/onboarding')`.
  - If `true` -> `navigate('/dashboard/feed')`.
- [ ] **Registration Flow**:
  - Step 1 Submit -> Call Register API (User only).
  - Success -> Auto Login (or redirect Login) -> Check `hasProfile` (will be false) -> Redirect to `/onboarding`.
- [ ] **Onboarding Page**:
  - Validates form.
  - Calls `POST /api/v1/users/profile`.
  - Success -> Redirect `/dashboard/feed`.

## Verification

- [ ] **Scenario A (New User)**: Register -> Login -> Redirect to Onboarding -> Fill Form -> Sidebar/Feed.
- [ ] **Scenario B (Existing User)**: Login -> Has Profile -> Direct to Feed.
