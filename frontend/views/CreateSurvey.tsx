import { Component, template } from "uix/components/Component.ts";
import { ALL_SURVEY_TYPES } from "common/surveys/all.ts";
import { Survey } from "common/surveys/surveys.ts";
import { Surveys } from "backend/data.ts";
import { t } from "common/i18n/i18n.ts";
import { LanguageSwitcher } from "common/components/LanguageSwitcher.tsx";

@template(function () {
    return <main>
        <LanguageSwitcher />
        <h2>{always(() => t("create_survey_heading"))}</h2>
        <section>
            {ALL_SURVEY_TYPES.map(async (typeName) => {
                const surveyDefinition = (await import(`common/surveys/${typeName}/survey.ts`)).default as Survey<unknown>;

                return <button
                    class="survey-type"
                    type="button"
                    onclick={async () => {
                        const { id, administrationToken } = await Surveys.create(typeName);
                        window.location.href = `/edit/${id}?token=${administrationToken}`;
                    }}
                >
                    <img
                        src={new URL(`../../common/surveys/${typeName}/icon.svg`, import.meta.url).href}
                        alt={surveyDefinition.label}
                    />
                    <span>{surveyDefinition.label}</span>
                </button>;
            })}
        </section>
    </main>;
})
export class CreateSurvey extends Component {}
