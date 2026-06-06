import { Component, template } from "uix/components/Component.ts";

import { AutoSaveLabel } from "common/components/AutoSaveLabel.tsx";
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
    const administrationToken = new URLSearchParams(window.location.search).get("token") ?? "";

    const copiedMetadata = $({
        participantLink: false,
        editLink: false,
        surveyId: false
    });

    return <div class="editor-view">
        <div class="editor-component">
            {new surveyDefinition.editorView({
                survey,
                editableConfiguration: await survey.getEditableConfiguration(administrationToken)
                    .catch((error) => {
                        if (error.message.includes("Unauthorized")) {
                            alert("You are not authorized to edit this survey.");
                            window.location.href = "/";
                        } else throw error;
                    }),
            })}
        </div>
        <div class="share panel">
            <div class="title">Share your survey</div>
            <AutoSaveLabel />

            <div class="link-rows">
                <div class="link-row">
                    <div class="link-label">Participant Link</div>
                    <div class="link-field">
                        <span>{`${window.location.host}/${props.surveyId}`}</span>
                        <button type="button" onclick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/${props.surveyId}`);
                            copiedMetadata.participantLink = true;
                        }}>{!copiedMetadata.participantLink ? "Copy Link" : "Copied"}</button>
                    </div>
                </div>

                <div class="link-row">
                    <div class="link-label">Edit and Moderate this Survey</div>
                    <div class="link-field">
                        <span>{`${window.location.host}/edit/${props.surveyId}?token=${administrationToken}`}</span>
                        <button type="button" onclick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/edit/${props.surveyId}?token=${administrationToken}`);
                            copiedMetadata.editLink = true;
                        }}>{!copiedMetadata.editLink ? "Copy Link" : "Copied"}</button>
                    </div>
                </div>

                <div class="link-row">
                    <div class="link-label">Survey ID</div>
                    <div class="link-field">
                        <span>{props.surveyId}</span>
                        <button type="button" onclick={() => {
                            navigator.clipboard.writeText(props.surveyId);
                            copiedMetadata.surveyId = true;
                        }}>{!copiedMetadata.surveyId ? "Copy ID" : "Copied"}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>;
})
export class EditorView extends Component<Props> {};
