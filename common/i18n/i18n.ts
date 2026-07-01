import { type Locale, translations, type TranslationKey } from "./translations.ts";

export { type Locale, type TranslationKey };

/** Active language. Defaults to German. */
export const currentLocale = $<Locale>("de");

/** Returns the translation for `key` in the active language. */
export function t(key: TranslationKey): string {
    return translations[currentLocale.val][key];
}

/** Returns the BCP-47 locale tag for the active language (e.g. "de-DE"). */
export function locale(): string {
    return translations[currentLocale.val].locale;
}
