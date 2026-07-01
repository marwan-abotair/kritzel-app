import { Component, template } from "uix/components/Component.ts";
import { currentLocale, type Locale } from "common/i18n/i18n.ts";

const LABELS: Record<Locale, string> = {
    de: "DE",
    en: "EN",
};

@template(function () {
    return <div class="language-switcher" role="group" aria-label="Sprache / Language">
        {(Object.keys(LABELS) as Locale[]).map(lang =>
            <button
                type="button"
                class={currentLocale.val === lang ? "active" : ""}
                aria-pressed={currentLocale.val === lang}
                onclick={() => { currentLocale.val = lang; }}
            >
                {LABELS[lang]}
            </button>
        )}
    </div>;
})
export class LanguageSwitcher extends Component {}
