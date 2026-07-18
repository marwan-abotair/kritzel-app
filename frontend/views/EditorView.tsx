import { Component, template } from "uix/components/Component.ts";

import { AutoSaveLabel } from "common/components/AutoSaveLabel.tsx";
import { LanguageSwitcher } from "common/components/LanguageSwitcher.tsx";
import { type Survey } from "common/surveys/surveys.ts";
import { Surveys } from "backend/data.ts";
import { localtext } from "datex-core-legacy/datex_short.ts";

type Props = {
    surveyId: string;
}

const strings = {
    notFound: localtext({ en: "This survey could not be found.", de: "Diese Umfrage wurde nicht gefunden." }),
    unauthorized: localtext({ en: "You are not authorized to edit this survey.", de: "Du bist nicht berechtigt, diese Umfrage zu bearbeiten." }),
    shareTitle: localtext({ en: "Share your survey", de: "Umfrage teilen" }),
    participantLinkLabel: localtext({ en: "Participant Link", de: "Teilnahme-Link" }),
    editLinkLabel: localtext({ en: "Edit and Moderate this Survey", de: "Bearbeiten und moderieren" }),
    surveyIdLabel: localtext({ en: "Survey ID", de: "Umfrage-ID" }),
    copyLink: localtext({ en: "Copy Link", de: "Link kopieren" }),
    copyId: localtext({ en: "Copy ID", de: "ID kopieren" }),
    copied: localtext({ en: "Copied", de: "Kopiert" }),
};

@template(async function (props) {
    const survey = await Surveys.get(props.surveyId);
    if (typeof survey === "undefined") {
        /* TODO: redirect to a proper 404 page */
        return <div>{strings.notFound}</div>;
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
                            alert(strings.unauthorized.val);
                            window.location.href = "/";
                        } else throw error;
                    }),
            })}
        </div>
        <div class="share panel">
            <div class="title">{strings.shareTitle}</div>
            <AutoSaveLabel />

            <div class="link-rows">
                <div class="link-row">
                    <div class="link-label">{strings.participantLinkLabel}</div>
                    <div class="link-field">
                        <span>{`${window.location.host}/${props.surveyId}`}</span>
                        <button type="button" onclick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/${props.surveyId}`);
                            copiedMetadata.participantLink = true;
                        }}>{!copiedMetadata.participantLink ? strings.copyLink : strings.copied}</button>
                    </div>
                </div>

                <div class="link-row">
                    <div class="link-label">{strings.editLinkLabel}</div>
                    <div class="link-field">
                        <span>{`${window.location.host}/edit/${props.surveyId}?token=${administrationToken}`}</span>
                        <button type="button" onclick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/edit/${props.surveyId}?token=${administrationToken}`);
                            copiedMetadata.editLink = true;
                        }}>{!copiedMetadata.editLink ? strings.copyLink : strings.copied}</button>
                    </div>
                </div>

                <div class="link-row">
                    <div class="link-label">{strings.surveyIdLabel}</div>
                    <div class="link-field">
                        <span>{props.surveyId}</span>
                        <button type="button" onclick={() => {
                            navigator.clipboard.writeText(props.surveyId);
                            copiedMetadata.surveyId = true;
                        }}>{!copiedMetadata.surveyId ? strings.copyId : strings.copied}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>;
})
export class EditorView extends Component<Props> {};
