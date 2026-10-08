import { Component, template } from "uix/components/Component.ts";
import { AppState } from "frontend/appstate.ts";
import { AuthEndpoint } from "backend/auth.ts";

@template(function (this: Home) {
    return <main>
		<div class="auth-status-bar">
			{always(() => AppState.currentUserId.val ? 
				<div>
					<span>Eingeloggt als <strong>{AppState.currentUsername.val}</strong></span>
                    <button type="button" onclick={() => { AppState.clearSession(); window.location.href = '/'; }}>Ausloggen</button>
				</div>
				:
				<div>
					<a href="/login">Anmelden</a>
				</div>
			)}
		</div>
        <h1>Kritzel</h1>
        
            {always(() => AppState.currentUserId.val !== null && this.mySurveys.length > 0
            ? (
                <section class="panel my-surveys-section">
                    <h2>Meine Umfragen</h2>
                    <ul>
                        {this.mySurveys.map(id => (
                            <li>
                                <a href={`/${id}`}>
                                📅 Umfrage: {id}
                                </a>
                                </li>
                        ))}
                    </ul>
                </section>
                )
                : null
            )}
            
        <div class="join-by-id">
            <input
                type="text"
                placeholder="Termin ID"
                value={this.surveyId}
                maxlength={6}
            />

            <button
                class="secondary"
                type="submit"
                onclick={() => window.location.href = `/${this.surveyId.val.toLowerCase()}`}
                disabled={always(() => this.surveyId.val.length !== 6)}
            >
                Termin öffnen
            </button>
        </div>

        <div class="or-divider">ODER</div>

        <a href="/create-survey" class="create-survey">
            <button type="button">Termin erstellen</button>
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

	mySurveys = $<string[]>([]);
    surveyId = $("");

	protected override async onCreate() {

		if (AppState.currentUserId.val) {
			await this.loadSurveys();
		}

		observe(AppState.currentUserId, (userId) => {
			if (userId) {
				this.loadSurveys();
			} else {
				this.mySurveys.length = 0;
			}
		});
	}

	private async loadSurveys() {
		const userId = AppState.currentUserId.val;
		if (userId) {
            const surveys = await AuthEndpoint.getUserSurveys(userId);
			this.mySurveys.length = 0;
            for (const id of surveys) {
                this.mySurveys.push(id);
            }
		}
	}
}
