import { Component, template } from "uix/components/Component.ts";
import { t } from "common/i18n/i18n.ts";
import { LanguageSwitcher } from "common/components/LanguageSwitcher.tsx";

@template(function () {
    return <main class="home-layout">
        <LanguageSwitcher />
        <h1>Kritzel</h1>
        <div class="join-by-id" role="search">
            <label for="schedule-id-input" class="visually-hidden">
                {always(() => t("home_schedule_id_placeholder"))}
            </label>
            <input
                id="schedule-id-input"
                type="text"
                placeholder={always(() => t("home_schedule_id_placeholder"))}
                value={this.surveyId.val}
                maxlength={6}
                aria-label={always(() => t("home_schedule_id_placeholder"))}
            />

            <button
                class="secondary"
                type="submit"
                onclick={() => window.location.href = `/${this.surveyId.val.toLowerCase()}`}
                disabled={!this.idSubmittable.val}
                aria-label={always(() => t("home_open_schedule"))}
            >
                {always(() => t("home_open_schedule"))}
            </button>
        </div>

        <div class="or-divider" role="separator" aria-hidden="true">
            {always(() => t("home_or"))}
        </div>

        <a href="/create-survey" class="create-survey">
            <button type="button">{always(() => t("home_create_schedule"))}</button>
        </a>
    </main>;
})
export class Home extends Component {
    surveyId = $("");
    idSubmittable = always(() => this.surveyId.val.trim().length == 6);
}
