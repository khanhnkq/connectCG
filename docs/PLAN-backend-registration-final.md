# Plan: Backend Registration with Profile & Avatar (Refined)

## Goal

Implement `AuthService.register` to map `RegisterRequest` to `User` account, `UserProfile` details, and handle `avatarUrl` by creating `Media` and `UserAvatar` records.

## Implementation Steps

### 1. `AuthServiceImpl.java`

- [ ] **Inject Additional Repositories**:

  - `MediaRepository`
  - `UserAvatarRepository`

- [ ] **Register Logic Updates**:
  - ... (User & Profile logic remains)
  - **Avatar Handling**:
    - If `request.getAvatarUrl()` is not null/empty:
      - Create `Media` entity:
        - `type` = "IMAGE"
        - `url` = request.getAvatarUrl()
        - `uploader` = savedUser
        - `createdAt` = now()
      - Save `Media`.
      - Create `UserAvatar` entity:
        - `user` = savedUser
        - `media` = savedMedia
        - `isCurrent` = true
      - Save `UserAvatar`.

## Verification

- [ ] **Manual Verification**: Submit registration with avatar. Check `media` and `user_avatars` tables.
