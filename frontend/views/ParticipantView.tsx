import { Component, template } from "uix/components/Component.ts";

import { type Survey } from "common/surveys/surveys.ts";
import { Surveys } from "backend/data.ts";

type Props = {
	surveyId: string;
}

@template(async function (props) {
	const survey = await Surveys.get(props.surveyId);
	if (typeof survey === "undefined") {
		/* TODO: redirect to a proper 404 page */
		return <div>This survey could not be found.</div>;
	}

	const surveyDefinition = (await import(`common/surveys/${survey.type}/survey.ts`)).default as Survey<unknown>;

	return <div class="participant-view">
		<div class="participant-component">
			{new surveyDefinition.participantView({ survey })}
		</div>
	</div>;
})
export class ParticipantView extends Component<Props> {};
