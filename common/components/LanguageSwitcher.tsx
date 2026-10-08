import { Component, template } from "uix/components/Component.ts";
import { UIX } from "uix";
import { localtext } from "datex-core-legacy/datex_short.ts";

const label = localtext({ en: "Language", de: "Sprache" });

@template(function () {
	return <div class="language-switcher" role="group" aria-label={label}>
		{(["de", "en"] as const).map(lang =>
			<button
				type="button"
				class={UIX.language === lang ? "active" : ""}
				aria-pressed={UIX.language === lang}
				onclick={() => { UIX.language = lang; }}
			>
				{lang.toUpperCase()}
			</button>
		)}
	</div>;
})
export class LanguageSwitcher extends Component {}
