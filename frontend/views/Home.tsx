import { Component, template } from "uix/components/Component.ts";
import { AppState } from "frontend/appstate.ts";

@template(function (this: Home) {
    return <main>
		<div class="auth-status-bar">
			{always(() => AppState.currentUser.val ? 
				<div>
					<span>Eingeloggt als <strong>{AppState.currentUser.val.username}</strong></span>
					<button type="button" onclick={() => AppState.clearSession()}>Ausloggen</button>
				</div>
				:
				<div>
					<a href="/login">Anmelden</a>
				</div>
			)}
		</div>
        <h1>Kritzel</h1>
        <div class="join-by-id">
            <input
                type="text"
                placeholder="Termin ID"
                value={this.surveyId.val}
                maxlength={6}
            />

            <button
                class="secondary"
                type="submit"
                onclick={() => window.location.href = `/${this.surveyId.val.toLowerCase()}`}
                disabled={!this.idSubmittable.val}
            >
                Termin öffnen
            </button>
        </div>

        <div class="or-divider">ODER</div>

        <a href="/create-survey" class="create-survey">
            <button type="button">Termin erstellen</button>
        </a>
    </main>;
})
export class Home extends Component {
    surveyId = $("");
    idSubmittable = always(() => this.surveyId.val.trim().length == 6);
}
