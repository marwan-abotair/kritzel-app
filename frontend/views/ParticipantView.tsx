import { Component, template } from "uix/components/Component.ts";

import { type Survey } from "common/surveys/surveys.ts";
import { Surveys } from "backend/data.ts";
import { LanguageSwitcher } from "common/components/LanguageSwitcher.tsx";
import { localtext } from "datex-core-legacy/datex_short.ts";

type Props = {
	surveyId: string;
}

const notFound = localtext({ en: "This survey could not be found.", de: "Diese Umfrage wurde nicht gefunden." });

@template(async function (props) {
	const survey = await Surveys.get(props.surveyId);
	if (typeof survey === "undefined") {
		/* TODO: redirect to a proper 404 page */
		return <div>{notFound}</div>;
	}

	const surveyDefinition = (await import(`common/surveys/${survey.type}/survey.ts`)).default as Survey<unknown>;

	return <div class="participant-view">
		<LanguageSwitcher />
		<div class="participant-component">
			{new surveyDefinition.participantView({ survey })}
		</div>
	</div>;
})
export class ParticipantView extends Component<Props> {};
