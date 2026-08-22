# Frontend flexible deployment

## Goal
Deploy the frontend independently to a VPS from one immutable GHCR image or deploy the same source to Vercel.

## Tasks
- [x] Add runtime frontend configuration so a VPS image does not need rebuilding per domain.
- [x] Add an Nginx production image and pull-only Compose file.
- [x] Publish verified frontend images as `latest`, `sha-*`, and release tags.
- [x] Add a TUI for VPS configuration/deploy/rollback and Vercel configuration/deploy.
- [x] Validate shell syntax, frontend build, Docker build, and rendered Compose.

## Done When
- [x] One frontend image runs against backend URLs supplied when the container starts.
- [x] Both VPS and Vercel paths can be configured without editing environment files manually.
