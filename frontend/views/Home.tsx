import { Component, template } from "uix/components/Component.ts";

@template(function () {
    return <main class="home-layout">
        <h1>Kritzel</h1>
        <div class="join-by-id">
            <input
                type="text"
                placeholder="Schedule ID"
                value={this.surveyId.val}
                maxlength={6}
            />

            <button
                class="secondary"
                type="submit"
                onclick={() => window.location.href = `/${this.surveyId.val.toLowerCase()}`}
                disabled={!this.idSubmittable.val}
            >
                Open Schedule
            </button>
        </div>

        <div class="or-divider">OR</div>

        <a href="/create-survey" class="create-survey">
            <button type="button">Create Schedule</button>
        </a>

        <footer style="margin-top: 40px; font-size: 0.9em; text-align: center; gap: 15px; display: flex; justify-content: center;">
            <a href="/impressum">Impressum</a>
            <a href="/datenschutz">Datenschutz</a>
        </footer>
    </main>;
})
export class Home extends Component {
    surveyId = $("");
    idSubmittable = always(() => this.surveyId.val.trim().length == 6);
}
import { Component, template } from "uix/components/Component.ts";
import { LanguageSwitcher } from "common/components/LanguageSwitcher.tsx";
import { localtext } from "datex-core-legacy/datex_short.ts";

const placeholder = localtext({ en: "Schedule ID", de: "Termin-ID" });
const openButton = localtext({ en: "Open Schedule", de: "Termin öffnen" });
const orDivider = localtext({ en: "OR", de: "ODER" });
const createButton = localtext({ en: "Create Schedule", de: "Termin erstellen" });

@template(function () {
    return <main class="home-layout">
        <LanguageSwitcher />
        <h1>Kritzel</h1>
        <div class="join-by-id">
            <input
                type="text"
                placeholder={placeholder}
                value={this.surveyId.val}
                maxlength={6}
            />

            <button
                class="secondary"
                type="submit"
                onclick={() => window.location.href = `/${this.surveyId.val.toLowerCase()}`}
                disabled={!this.idSubmittable.val}
            >
                {openButton}
            </button>
        </div>

        <div class="or-divider">{orDivider}</div>

        <a href="/create-survey" class="create-survey">
            <button type="button">{createButton}</button>
        </a>
    </main>;
})
export class Home extends Component {
    surveyId = $("");
    idSubmittable = always(() => this.surveyId.val.trim().length == 6);
}
