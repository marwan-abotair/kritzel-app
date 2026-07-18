# i18n – Language Switcher

## What was done

All user-visible strings were previously hardcoded directly in the components. This branch extracts them into a central translation file and adds a DE/EN language toggle to the app.

## New files

- `common/i18n/translations.ts` — all UI strings in German and English, grouped by component
- `common/i18n/i18n.ts` — exposes `t(key)` for translations, `locale()` for date/time formatting, and `currentLocale` as a reactive pointer
- `common/components/LanguageSwitcher.tsx` — DE/EN toggle button placed in all four views
- `common/components/LanguageSwitcher.css` — styling for the switcher

## Modified files

- All components and views under `frontend/views/` and `common/` now use `t()` for every UI string
- `Participant.tsx` — hardcoded `"de-DE"` locale codes replaced with `locale()` so dates and times switch with the active language
- `Home.css`, `CreateSurvey.css` — added `position: relative` so the LanguageSwitcher positions correctly

## How to add new strings

1. Add the key and its value to both `de` and `en` blocks in `common/i18n/translations.ts`
2. Use it in your component: `always(() => t("your_key"))`

TypeScript will give an error if the key is missing in either language.
