import { Component, template } from "uix/components/Component.ts";
import { LanguageSwitcher } from "common/components/LanguageSwitcher.tsx";
import { localtext } from "datex-core-legacy/datex_short.ts";

const strings = {
	placeholder: localtext({ en: "Schedule ID", de: "Termin-ID" }),
	openButton: localtext({ en: "Open Schedule", de: "Termin öffnen" }),
	orDivider: localtext({ en: "OR", de: "ODER" }),
	createButton: localtext({ en: "Create Schedule", de: "Termin erstellen" }),
};

@template(function () {
	return <main class="home-layout">
		<LanguageSwitcher />
		<h1>Kritzel</h1>
		<div class="join-by-id">
			<input
				type="text"
				placeholder={strings.placeholder}
				value={this.surveyId.val}
				maxlength={6}
			/>

			<button
				class="secondary"
				type="submit"
				onclick={() => window.location.href = `/${this.surveyId.val.toLowerCase()}`}
				disabled={!this.idSubmittable.val}
			>
				{strings.openButton}
			</button>
		</div>

		<div class="or-divider">{strings.orDivider}</div>

		<a href="/create-survey" class="create-survey">
			<button type="button">{strings.createButton}</button>
		</a>
	</main>;
})
export class Home extends Component {
	surveyId = $("");
	idSubmittable = always(() => this.surveyId.val.trim().length == 6);
}
