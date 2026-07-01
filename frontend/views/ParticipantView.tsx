import { Component, template } from "uix/components/Component.ts";

import { type Survey } from "common/surveys/surveys.ts";
import { Surveys } from "backend/data.ts";
import { LanguageSwitcher } from "common/components/LanguageSwitcher.tsx";
import { t } from "common/i18n/i18n.ts";

type Props = {
	surveyId: string;
}

@template(async function (props) {
	const survey = await Surveys.get(props.surveyId);
	if (typeof survey === "undefined") {
		return <div role="alert">{always(() => t("participant_survey_not_found"))}</div>;
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
