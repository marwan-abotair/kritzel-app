import { Component, template } from "uix/components/Component.ts";

import { AutoSaveLabel } from "common/components/AutoSaveLabel.tsx";
import { LanguageSwitcher } from "common/components/LanguageSwitcher.tsx";
import { type Survey } from "common/surveys/surveys.ts";
import { Surveys } from "backend/data.ts";
import { t } from "common/i18n/i18n.ts";

type Props = {
    surveyId: string;
}

@template(async function (props) {
    const survey = await Surveys.get(props.surveyId);
    if (typeof survey === "undefined") {
        return <div role="alert">{always(() => t("editor_survey_not_found"))}</div>;
    }

    const surveyDefinition = (await import(`common/surveys/${survey.type}/survey.ts`)).default as Survey<unknown>;
    const administrationToken = new URLSearchParams(window.location.search).get("token") ?? "";

    const copiedMetadata = $({
        participantLink: false,
        editLink: false,
        surveyId: false
    });

    return <div class="editor-view">
        <LanguageSwitcher />
        <div class="editor-component">
            {new surveyDefinition.editorView({
                survey,
                editableConfiguration: await survey.getEditableConfiguration(administrationToken)
                    .catch((error) => {
                        if (error.message.includes("Unauthorized")) {
                            alert(t("editor_unauthorized"));
                            window.location.href = "/";
                        } else throw error;
                    }),
            })}
        </div>
        <div class="share panel">
            <div class="title">{always(() => t("editor_share_title"))}</div>
            <AutoSaveLabel />

            <div class="link-rows">
                <div class="link-row">
                    <div class="link-label" id="label-participant">{always(() => t("editor_participant_link_label"))}</div>
                    <div class="link-field" role="group" aria-labelledby="label-participant">
                        <span>{`${window.location.host}/${props.surveyId}`}</span>
                        <button type="button" onclick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/${props.surveyId}`);
                            copiedMetadata.participantLink = true;
                        }}>
                            {always(() => !copiedMetadata.participantLink ? t("editor_copy_link") : t("editor_copied"))}
                        </button>
                    </div>
                </div>

                <div class="link-row">
                    <div class="link-label" id="label-edit">{always(() => t("editor_edit_link_label"))}</div>
                    <div class="link-field" role="group" aria-labelledby="label-edit">
                        <span>{`${window.location.host}/edit/${props.surveyId}?token=${administrationToken}`}</span>
                        <button type="button" onclick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/edit/${props.surveyId}?token=${administrationToken}`);
                            copiedMetadata.editLink = true;
                        }}>
                            {always(() => !copiedMetadata.editLink ? t("editor_copy_link") : t("editor_copied"))}
                        </button>
                    </div>
                </div>

                <div class="link-row">
                    <div class="link-label" id="label-surveyid">{always(() => t("editor_survey_id_label"))}</div>
                    <div class="link-field" role="group" aria-labelledby="label-surveyid">
                        <span>{props.surveyId}</span>
                        <button type="button" onclick={() => {
                            navigator.clipboard.writeText(props.surveyId);
                            copiedMetadata.surveyId = true;
                        }}>
                            {always(() => !copiedMetadata.surveyId ? t("editor_copy_id") : t("editor_copied"))}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>;
})
export class EditorView extends Component<Props> {};
