# Plan: Sidebar Layout Redesign

## Goal

Fix the layout of the Sidebar component, specifically moving the misplaced Logout button to the bottom of the sidebar and ensuring a clean visual hierarchy.

## Proposed Changes

### 1. `src/components/layout/Sidebar.jsx`

- [ ] **Remove Logout Button from Header**
  - Current location: Inside the top `div` (profile section).
  - Action: Remove the button code from this section.
- [ ] **Add Logout Button to Footer**
  - New location: Below the `nav` section and before/after "Go Premium" card.
  - Styling: Use `mt-auto` to push it to the bottom.
  - visual style: Consistent with nav items but with red hover color for danger action.

## Verification

- [ ] **Manual Verification**
  - View Sidebar.
  - Verify Logout button is at the bottom.
  - Verify "Go Premium" card is visible.
  - Click Logout to ensure functionality persists.
