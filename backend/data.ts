import { StoredSurvey, type Survey } from "common/surveys/surveys.ts";
import type { ALL_SURVEY_TYPES } from "common/surveys/all.ts";

import { nanoid } from "common/lib/nanoid.js";

@endpoint
export class Surveys {
	@property static async create(type: typeof ALL_SURVEY_TYPES[number]) {
		const survey = (await import(`common/surveys/${type}/survey.ts`)).default as Survey<unknown>;

		let id: string;
		do { id = nanoid(6).toLowerCase(); } while (StoredSurvey.exists(id));
		const administrationToken = nanoid();

		StoredSurvey.init({
			id,
			type,
			configuration: JSON.parse(JSON.stringify(survey.defaultData)),
			administrationToken
		});
		
		return { id, administrationToken };
	}

	@property static async get(id: string) {
		const survey = StoredSurvey.getById(id);		
		return survey;
	}
}
