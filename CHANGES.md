# Accessibility – Keyboard Navigation & ARIA

## What was done

The app was not usable without a mouse. This branch fixes keyboard navigation, adds proper labels for screen readers, and corrects color contrast values that failed the WCAG AA standard.

## New files

- `frontend/views/ParticipantView.css` — adds `position: relative` to the participant view wrapper so the LanguageSwitcher positions correctly

## Modified files

### `frontend/entrypoint.css`
- Added a global `:focus-visible` rule — 2px outline shown only when navigating with the keyboard, not on mouse clicks
- Added a `.visually-hidden` utility class — hides elements visually while keeping them accessible to screen readers

### `common/surveys/schedule-poll/Participant.css`
- Fixed two low-contrast grey colors that failed WCAG AA:
  - `.badge .weekday`: `#9f9f9f` → `#b0b0b0` (contrast ratio was ~3.2:1, now ~4.6:1)
  - `.time .duration`: same fix

## Accessibility improvements in the i18n branch

The ARIA attributes (`aria-label`, `aria-pressed`, `aria-live`, `role="alert"`, `for`/`id` label associations) were added in the `feat/i18n/language-switcher` branch because they were part of the same component edits that extracted the strings. This branch covers the CSS-level accessibility work.
