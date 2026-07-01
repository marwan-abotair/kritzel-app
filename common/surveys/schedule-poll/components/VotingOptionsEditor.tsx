import { Component, template } from "uix/components/Component.ts";
import { UIX } from "uix";

import { Database } from "../static/emoji-picker-element-1-29-1.js";
import { VoteOption } from "common/surveys/schedule-poll/types.ts";
import { t } from "common/i18n/i18n.ts";

type Props = {
    options: VoteOption[]
}

@template(function (props) {
    const _ = new Database(); /* Otherwise, the <emoji-picker> will not load */

    return <div class="voting-options panel">
        <div class="title">{always(() => t("voting_options_title"))}</div>
        <div class="explanation">{always(() => t("voting_options_explanation"))}</div>

        <div class="options">
            <uix-fragment>
                {props.options.map(async (option, index) => {
                    const pickerOpen = $(false);
                    const picker = <emoji-picker class={`${UIX.Theme.mode}`} />;
                    // deno-lint-ignore no-explicit-any
                    picker.addEventListener("emoji-click", (event: any) => {
                        option.icon = event.detail.emoji.unicode;
                        pickerOpen.val = false;
                    });

                    return <div class="option">
                        <button
                            type="button"
                            onclick={() => pickerOpen.val = !pickerOpen.val}
                            aria-label={always(() => t("voting_option_open_emoji"))}
                            aria-expanded={pickerOpen.val}
                            aria-haspopup="dialog"
                        >
                            {option.icon}
                        </button>
                        {pickerOpen.val && <div
                            class="emoji-picker-backdrop"
                            onclick={() => pickerOpen.val = false}
                            aria-hidden="true"
                        ></div>}
                        {pickerOpen.val && picker}
                        <input
                            type="text"
                            value={option.label}
                            placeholder={always(() => t("voting_option_label_placeholder"))}
                            aria-label={always(() => t("voting_option_label_placeholder"))}
                        />
                        <button
                            type="button"
                            class="remove"
                            onclick={() => props.options.splice(index, 1)}
                            aria-label={always(() => t("voting_option_remove"))}
                        >✗</button>
                    </div>;
                })}
            </uix-fragment>

            <button
                type="button"
                class="add-option"
                onclick={() => this.addOption()}
            >
                {always(() => t("voting_option_add"))}
            </button>
        </div>
    </div>;
})
export class VotingOptionsEditor extends Component<Props> {
    private addOption() {
        this.properties.options.push({
            label: "",
            icon: "👍️",
        });
    }
};
